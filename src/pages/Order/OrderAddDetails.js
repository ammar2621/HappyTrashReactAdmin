import React, { Component } from "react";
import { MDBContainer } from "mdbreact";
import axios from "axios";
import { connect } from "unistore/react";
import { actions } from "../../store/store";
import { Redirect } from 'react-router-dom'
import Header from '../../components/Header'
import './Order.css'
import Swal from 'sweetalert2'

class OrderAddDetails extends Component {
    constructor(props) {
        super(props);
        this.trash_id = React.createRef();
        this.weight = React.createRef();
        this.state = {
            trashes: [],
            toPut: [],
            toDisplay: [],
            trash_id: null,
            trash_name: null,
            qty: null,
            notFoundDetail: "---Tabel Kosong---"
        }
    }

    // function that enabled after renderred
    componentDidMount() {
        const self = this;
        let config = {
            method: "GET",
            url: self.props.url + "/v1/trash",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("admin_token")
            }
        }
        axios(config)
            .then(function (response) {
                self.setState({ trashes: response.data })
            })
            .catch(function (error) {
            })
    }

    // to add more trash details
    addAnother = async e => {
        e.preventDefault();
        this.setState({ notFoundDetail: "" })
        if (this.state.qty == null || this.state.qty == '') {
            Swal.fire({
                type: 'error',
                title: 'Oops....',
                text: 'Silakan isi dulu beratnya!'
            })
            return;
        } else if (this.state.trash_id == '' || this.state.trash_id == null) {
            Swal.fire({
                type: 'error',
                title: 'Oops....',
                text: 'Silakan pilih kembali sampahnya!'
            })
            return;
        }
        let new_put = await {
            trash_id: this.state.trash_id,
            qty: Math.abs(this.state.qty)
        }
        let new_display = await {
            qty: Math.abs(this.state.qty),
            trash_name: this.state.trash_name
        }
        this.state.toPut.push(new_put);
        this.state.toDisplay.push(new_display);
        await this.setState({
            qty: '',
            trash_id: ''
        })
        this.trash_id.current.value = null
        this.componentDidMount();
    }

    // delete one detail
    deleteDetailUnit = async (e, index) => {
        e.preventDefault()
        const toDisplay = this.state.toDisplay
        const toPut = this.state.toPut
        const deleteDisplay = toDisplay.splice(index, index + 1)
        const deletePut = toPut.splice(index, index + 1)
        this.setState({ toDisplay, toPut })
        if (toDisplay.length === 0 | toPut === 0) {
            this.setState({
                notFoundDetail: "---Tabel Kosong---"
            })
        }
    }

    // to checkout ALL the trashes details
    checkOut = e => {
        e.preventDefault();
        if (this.state.toDisplay.length === 0 | this.state.toPut === 0) {
            Swal.fire({
                type: 'error',
                title: 'Oops....',
                text: 'Tidak boleh kosong!'
            })
            return;
        }
        const self = this;
        let config = {
            method: "PUT",
            url: self.props.url + "/v1/orders/" + self.props.match.params.order_id,
            data: {
                'status': 'done',
                'details': self.state.toPut
            },
            headers: {
                Authorization: "Bearer " + localStorage.getItem("admin_token")
            }
        }
        axios(config)
            .then(function (response) {
                self.props.history.push("/order/invoice/" + self.props.match.params.order_id)
            })
            .catch(function (error) {
            })
    }

    render() {
        if (localStorage.getItem('admin_logged_in') == 'true') {
            return (
                <div style={{ height: "100vh" }}>
                    <Header />
                    <MDBContainer id="bodyreward">
                        <br />
                        <h2 id="titlerewardedit">Tambah Detail Order</h2>
                        <form class="form-signin">
                            <label for="inputName">
                                Jenis Sampah:
                                    </label>
                            <select
                                ref={this.trash_id}
                                class="form-control"
                                onChange={e => {
                                    this.setState({ trash_id: this.state.trashes[e.target.value].id });
                                    this.setState({ trash_name: this.state.trashes[e.target.value].trash_name });
                                }}
                            >
                                <option value={null} disabled selected>Pilih Sampah</option>
                                {this.state.trashes.map((elm, key) => {
                                    return (
                                        <option value={key}> {elm.trash_name}</option>
                                    )
                                })}
                            </select>
                            <br />
                            <label for="inputPoint  ">
                                Berat (kg):
                            </label>
                            <input
                                type="number"
                                id="inputPoint  "
                                class="form-control"
                                placeholder="Berat"
                                min="0"
                                step="0.1"
                                value={this.state.qty}
                                onChange={e => this.setState({ qty: e.target.value })}
                            />
                            <br />
                            <button id="add-button-order" class="btn btn-lg btn-primary btn-block rounded-pill" type="submit" onClick={e => this.addAnother(e)}>
                                Tambahkan Sampah
                                    </button> <br />
                        </form>
                        <div className="table-responsive">
                            <table class="table ">
                                <thead>
                                    <tr>
                                        <th scope="col">Nama Sampah</th>
                                        <th scope="col">Berat</th>
                                        <th scope="col" style={{ width: '40px' }}>Hapus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.toDisplay.map((elm, key) => {
                                        return (
                                            <tr>
                                                <td>{elm.trash_name}</td>
                                                <td>{elm.qty}</td>
                                                <td><a onClick={e => this.deleteDetailUnit(e, key)}><p className="text-danger h6">X</p></a></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <p
                                className="text-center"
                                style={{ fontSize: '20px' }}
                            >
                                {this.state.notFoundDetail}
                            </p>
                            <button id="add-button-order" class="btn btn-lg btn-primary btn-block rounded-pill" type="submit" onClick={e => this.checkOut(e)}>
                                Checkout
                                    </button>
                            <br />
                        </div>
                    </MDBContainer>
                </div >
            );
        } else {
            return <Redirect to="/login" />
        }
    }
}
export default connect("url", actions)(OrderAddDetails);