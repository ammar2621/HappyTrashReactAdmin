import React, { Component } from "react";
import {
    MDBContainer,
    MDBTabPane,
    MDBTabContent,
    MDBNav,
    MDBNavItem,
    MDBNavLink
} from "mdbreact";
import axios from "axios";
import { connect } from "unistore/react";
import { actions } from "../../store";
import { Redirect, Link } from 'react-router-dom'
import Header from '../../components/Header'
import './Order.css'

class OrderAddDetails extends Component {
    constructor(props) {
        super(props);
        this.name = React.createRef();
        this.imageURL = React.createRef();
        this.price = React.createRef();
        this.point = React.createRef();
        this.categoryID = React.createRef();
        this.trash_id = React.createRef();
        this.qty = React.createRef();
        this.state = {
            trashes: [],
            toPut: [],
            toDisplay: [],
            trash_id: null,
            trash_name: null,
            qty: null
        }
    }

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
                console.log(response.data)
                self.setState({ trashes: response.data })
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    addAnother = async e => {
        e.preventDefault();
        let new_put = await {
            // trash_id: this.state.trash_id,
            // qty: parseInt(this.state.qty)
            trash_id: this.trash_id.current.value,
            qty: parseInt(this.qty.current.value)
        }

        let new_display = await {
            qty: this.state.qty,
            trash_name: this.state.trash_name
        }
        this.refs.trash_id.value = ''
        this.refs.qty.value = ''
        this.state.toPut.push(new_put);
        this.state.toDisplay.push(new_display);
        console.log(this.state.toDisplay, this.state.toPut)
        // e.reset()

    }


    checkOut = e => {
        e.preventDefault();
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
                console.log(response.data)
                self.props.history.push("/order/checkout/" + self.props.match.params.order_id)
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    render() {
        if (localStorage.getItem('admin_logged_in') == 'true') {
            return (
                <div style={{ height: "100vh" }}>
                    <Header />
                    <MDBContainer id="bodyreward">
                        <br />
                        {/* <table>
                            <thead>
                                <tr>
                                    <td>Nama Sampah </td>
                                    <td>Berat </td>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.toDisplay.map((elm, key) => {
                                    return (
                                        <tr>
                                            <td>{elm.trash_name}</td>
                                            <td>{elm.qty}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table> */}
                        <h2 id="titlerewardedit">Tambah Detail Order</h2>
                        <form class="form-signin">
                            <label for="inputName">
                                Jenis Sampah:
                                    </label>

                            <select class="form-control" id="status pembayaran" ref={this.trash_id}
                            // onChange={e => {
                            // this.setState({ trash_id: this.state.trashes[e.target.value].id });
                            // this.setState({ trash_name: this.state.trashes[e.target.value].trash_name });
                            // }}
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
                                min="1"
                                ref={this.qty}
                            // onChange={e => { this.setState({ qty: e.target.value }) }}
                            />
                            <br />
                            <button id="add-button-order" class="btn btn-lg btn-primary btn-block rounded-pill" type="submit" onClick={e => this.addAnother(e)}>
                                Tambahkan Sampah
                                    </button> <br />

                            <button id="checkout-button-order" class="btn btn-lg btn-primary btn-block rounded-pill" type="submit" onClick={e => this.checkOut(e)}>
                                Checkout
                                    </button> <br />

                        </form>
                    </MDBContainer>
                </div >
            );
        } else {
            return <Redirect to="/login" />
        }
    }
}
export default connect("url", actions)(OrderAddDetails);