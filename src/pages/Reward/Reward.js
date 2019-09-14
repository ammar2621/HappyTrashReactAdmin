import React, { Component } from "react";
import {
    MDBBtn,
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
import {
    Redirect,
    Link
} from 'react-router-dom'
import Header from '../../components/Header'
import './Reward.css'
import Swal from 'sweetalert2'

class Reward extends Component {
    constructor(props) {
        super(props);
        this.name = React.createRef();
        this.image = React.createRef();
        this.stock = React.createRef();
        this.point = React.createRef();
        this.status = React.createRef();
        this.state = {
            activeItem: "1",
            modal: false,
            reward: [],
            rewardHistory: []
        }
    }

    // function for the tab feature
    toggle = tab => e => {
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
        }
    };

    // add the reward (post to API)
    doAddReward = async e => {
        e.preventDefault();
        const regex_http = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
        const regex_number = /^\d+$/;
        const regex_name = /^[a-zA-Z ]{2,30}$/;;
        // check the name validation
        // if (!regex_name.test(this.name.current.value)) {
        //     Swal.fire({
        //         type: 'error',
        //         title: 'Oops...',
        //         text: 'Gunakan Huruf Untuk Nama (Minimal 2 Huruf)!'
        //     })
        //     return false
        // } else if (!regex_number.test(this.point.current.value)) {
        //     Swal.fire({
        //         type: 'error',
        //         title: 'Oops...',
        //         text: 'Gunakan Angka Untuk Poin!'
        //     })
        //     return false
        // } else if (!regex_number.test(this.price.current.value)) {
        //     Swal.fire({
        //         type: 'error',
        //         title: 'Oops...',
        //         text: 'Gunakan Angka Untuk Harga!'
        //     })
        //     return false
        // } else if (!regex_number.test(this.category.current.value)) {
        //     Swal.fire({
        //         type: 'error',
        //         title: 'Oops...',
        //         text: 'Gunakan Angka untuk Kategori!'
        //     })
        //     return false
        // } else if (!regex_http.test(this.photo.current.value)) {
        //     Swal.fire({
        //         type: 'error',
        //         title: 'Oops...',
        //         text: 'Gunakan Format URL yang Benar! (https://blabla.com/contoh.png)'
        //     })
        //     return false
        // }
        const self = this;
        await axios
            .post(this.props.url + `/v1/rewards`,
                {
                    point_to_claim: Number(this.point.current.value),
                    name: this.name.current.value,
                    stock: Number(this.stock.current.value),
                    photo: this.image.current.value,
                    status: Number(this.status.current.value)
                },
                {
                    headers: {
                        Authorization: "Bearer " + String(localStorage.getItem('admin_token'))
                    }
                })
            .then(response => {
                console.log(response.data)
                Swal.fire({
                    type: 'success',
                    title: 'Success',
                    text: 'Berhasil Menambahkan Jenis Sampah!'
                })
                this.name.current.value = ' '
                this.status.current.value = ' '
                this.stock.current.value = ' '
                this.point.current.value = ' '
                self.componentDidMount();
            })
            .catch(error => {
            });
    }

    // Function to pop up image
    openImage = (e, url) => {
        Swal.fire({
            html: `<img src=${url} style='max-width: 480px' class="text-center">`
        })
    }

    // function operate after renderred, to get the list of trashes and category of trashes
    componentDidMount = async () => {
        const self = this;
        // to get the all trashes 
        await axios
            .get(this.props.url + `/v1/rewards`,
                {
                    headers: {
                        Authorization: "Bearer " + String(localStorage.getItem('admin_token'))
                    }
                })
            .then(response => {
                console.log(response.data)
                this.setState({ reward: response.data })
            })
            .catch(error => {
                console.log(error)
            });
        // to get all categories
        await axios
            .get(this.props.url + '/v1/reward_history',
                {
                    headers: {
                        Authorization: "Bearer " + String(localStorage.getItem('admin_token'))
                    }
                })
            .then(response => {
                console.log("REWARD HISTORY", response.data)
                this.setState({ rewardHistory: response.data })
            })
            .catch(error => {
            });
    }


    render() {
        if (localStorage.getItem('admin_logged_in') == 'true') {
            return (
                <div style={{ height: "100vh" }}>
                    <Header />
                    <MDBContainer id="bodyreward" style={{ height: "100vh" }}>
                        <br />
                        <h2 id="titlereward">Pengaturan Hadiah</h2>
                        <MDBNav className="nav-tabs ">
                            <MDBNavItem>
                                <MDBNavLink className="tab-reward" active={this.state.activeItem === "1"} onClick={this.toggle("1")} role="tab" >
                                    Tambah Hadiah
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink className="tab-reward" active={this.state.activeItem === "2"} onClick={this.toggle("2")} role="tab" >
                                    List Hadiah
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink className="tab-reward" active={this.state.activeItem === "3"} onClick={this.toggle("3")} role="tab" >
                                    Penerima Hadiah
                                </MDBNavLink>
                            </MDBNavItem>
                        </MDBNav>
                        <MDBTabContent activeItem={this.state.activeItem} >
                            <MDBTabPane tabId="1" role="tabpanel">
                                <br />
                                <form class="form-signin">
                                    <label for="inputName" >
                                        Nama:
                                    </label>
                                    <input
                                        type="text"
                                        id="inputName"
                                        class="form-control"
                                        placeholder="Nama"
                                        required='required'
                                        ref={this.name}
                                    />
                                    <br />
                                    <label for="inputPoint  " >
                                        Poin:
                                    </label>
                                    <input
                                        type="number"
                                        id="inputPoint  "
                                        class="form-control"
                                        placeholder="Nilai Poin"
                                        min="1"
                                        ref={this.point}
                                    />
                                    <br />
                                    <label for="inputStock" >
                                        Stok:
                                    </label>
                                    <input
                                        type="number"
                                        id="inputStock"
                                        class="form-control"
                                        placeholder="Stok"
                                        min="0"
                                        ref={this.stock}
                                    />
                                    <br />
                                    <label for="inputStock">
                                        Status:
                                    </label>
                                    <select class="form-control" id="status pembayaran">
                                        <option ref={this.status} value='1'> Aktif</option>
                                        <option value='0'> Non-Aktif</option>
                                    </select>
                                    <br />
                                    <label for="inputStock" >
                                        URL Gambar:
                                    </label>
                                    <input
                                        type="text"
                                        id="inputStock"
                                        class="form-control"
                                        placeholder="URL Gambar"
                                        min="1"
                                        ref={this.image}
                                    />
                                    <br />
                                    <label for="inputPhoto" >
                                        Upload Foto (masih dalam pengembangan):
                                    </label> <br />
                                    <progress value="30" max="100" style={{ width: "100%" }} /> <br />
                                    <input className="" type="file" placeholder="Upload Gambar" /> <br />  <br />
                                    <button id="addbuttonreward" class="btn btn-lg btn-primary btn-block rounded-pill" type="submit" onClick={e => this.doAddReward(e)}>
                                        Tambah
                                    </button> <br />

                                </form>
                            </MDBTabPane>
                            <MDBTabPane tabId="2" role="tabpanel">
                                <div className="table-responsive">
                                    <table class="table ">
                                        <thead>
                                            <tr>
                                                <th scope="col">ID</th>
                                                <th scope="col">Nama</th>
                                                <th scope="col">Poin</th>
                                                <th scope="col">Stok</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Foto</th>
                                                <th scope="col">Ubah</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.reward.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td valign="bottom"> {item.id} </td>
                                                        <td valign="bottom"> {item.name}</td>
                                                        <td valign="bottom"> {item.point_to_claim}</td>
                                                        <td valign="bottom"> {item.stock} Pcs</td>
                                                        <td valign="bottom"> {String(item.status)}</td>
                                                        <td valign="bottom">
                                                            <MDBBtn style={{ padding: "4px" }}
                                                                className="button-white  btn btn-lg btn-block rounded-pill"
                                                                onClick={e => this.openImage(e, item.photo)}
                                                            >
                                                                Lihat
                                                            </MDBBtn>
                                                        </td>
                                                        <td valign="bottom">
                                                            <Link to={"/reward/edit/" + item.id}><button className="btn btn-lg btn-primary btn-block rounded-pill" type="submit" style={{ padding: "4px" }} valign="center"
                                                            >
                                                                Edit
                                                            </button>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </MDBTabPane>
                            <MDBTabPane tabId="3" role="tabpanel">
                                <div className="table-responsive">
                                    <table class="table ">
                                        <thead>
                                            <tr>
                                                <th scope="col">No</th>
                                                <th scope="col">ID Redeem</th>
                                                <th scope="col">Nama</th>
                                                <th scope="col">Hadiah</th>
                                                <th scope="col">Waktu</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.rewardHistory.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td valign="bottom">{item.id}</td>
                                                        <td valign="bottom"> {item.reward_id}</td>
                                                        <td valign="bottom"> {item.user_id} </td>
                                                        <td valign="bottom"> {item.reward_name}</td>
                                                        <td valign="bottom"> {item.created_at}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </MDBTabPane>
                        </MDBTabContent>
                    </MDBContainer>
                </div >
            );
        } else {
            return <Redirect to="/login" />
        }
    }
}
export default connect('url', actions)(Reward);