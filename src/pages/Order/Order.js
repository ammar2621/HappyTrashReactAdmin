import React, { Component } from "react";
import {
    MDBBtn,
    MDBContainer,
    MDBTabPane,
    MDBTabContent,
    MDBNav,
    MDBNavItem,
    MDBNavLink,
    MDBModal,
    MDBModalBody,
    MDBModalHeader,
    MDBModalFooter
} from "mdbreact";

import axios from "axios";
import { connect } from "unistore/react";
import { actions } from "../../store";
import {
    Redirect,
    Link
} from 'react-router-dom'
import Header from '../../components/Header'
import './Order.css'

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: "1",
            modalUser: false,
            modalAddress: false,
            modalPhoto: false,
            allOrder: [{ User: { name: null }, Order: { id: null }, Details: [] }],
            waitingOrder: [{ User: { name: null }, Order: {}, Details: [] }],
            confirmedOrder: [{ User: { name: null }, Order: {}, Details: [] }]
        }
    }

    toggle = tab => e => {
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
        }
    };

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    toggleModalUser = async () => {
        this.setState({
            modalUser: !this.state.modalUser
        });
    }

    toggleModalAddress = () => {
        this.setState({
            modalAddress: !this.state.modalAddress
        });
    }

    toggleModalPhoto = () => {
        this.setState({
            modalPhoto: !this.state.modalPhoto
        });
    }

    componentDidMount() {
        const self = this;
        let config = {
            method: "GET",
            url: self.props.url + "/v1/orders",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("admin_token")
            }
        }
        axios(config)
            .then(function (response) {

                localStorage.setItem('orders', JSON.stringify(response.data))

                let waitingOrder = response.data.filter(function (order) {
                    return order.Order.status == 'waiting'
                })

                let confirmedOrder = response.data.filter(function (order) {
                    return order.Order.status == 'confirmed'
                })


                self.setState({ allOrder: response.data })
                self.setState({ confirmedOrder })
                self.setState({ waitingOrder })
                console.log(self.state.allOrder)

            }).catch(function (error) {
                console.log(error)
            })
    }

    confirmOrder = (e, id) => {
        e.preventDefault();
        const self = this;
        let config = {
            method: "PUT",
            url: self.props.url + "/v1/orders/" + id,
            data: {
                "status": "confirmed"
            },
            headers: {
                Authorization: "Bearer " + localStorage.getItem("admin_token")
            }
        }

        axios(config)
            .then(function (response) {
                console.log(response);
                self.componentDidMount();
            })
            .catch(function (error) {
                console.log(error);
            })
    }


    rejectOrder = (e, id) => {
        e.preventDefault();
        const self = this;
        let config = {
            method: "PUT",
            url: self.props.url + "/v1/orders/" + id,
            data: {
                "status": "rejected"
            },
            headers: {
                Authorization: "Bearer " + localStorage.getItem("admin_token")
            }
        }

        axios(config)
            .then(function (response) {
                console.log(response);
                self.componentDidMount();
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    render() {
        if (localStorage.getItem('admin_logged_in') == 'true') {
            return (
                <div style={{ height: "100vh" }}>
                    <Header />
                    <MDBContainer id="bodyreward" style={{ height: "100vh" }}>
                        <br />
                        <h2 id="titlereward">Pengaturan Order</h2>
                        <MDBNav className="nav-tabs ">
                            <MDBNavItem>
                                <MDBNavLink className="tab-reward" active={this.state.activeItem === "1"} onClick={this.toggle("1")} role="tab" >
                                    Order Masuk
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink className="tab-reward" active={this.state.activeItem === "2"} onClick={this.toggle("2")} role="tab" >
                                    Order Terkonfirmasi
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink className="tab-reward" active={this.state.activeItem === "3"} onClick={this.toggle("3")} role="tab" >
                                    Riwayat Order
                                </MDBNavLink>
                            </MDBNavItem>
                        </MDBNav>
                        <MDBTabContent activeItem={this.state.activeItem} >
                            <MDBTabPane tabId="1" role="tabpanel">
                                <div className="table-responsive">
                                    <table class="table ">
                                        <thead>
                                            <tr>
                                                <th scope="col">User ID</th>
                                                <th scope="col">Waktu Penjemputan</th>
                                                <th scope="col">Waktu Dibuat</th>
                                                <th scope="col">Alamat</th>
                                                <th scope="col">Foto</th>
                                                <th scope="col">Terima</th>
                                                <th scope="col">Tolak</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.waitingOrder.map((elm, key) => {
                                                    return (
                                                        <tr>
                                                            <td valign="bottom">
                                                                <MDBBtn style={{ padding: "4px" }} className=" button-white  btn btn-lg btn-block rounded-pill" onClick={this.toggleModalUser}>
                                                                    {elm.Order.user_id}
                                                                </MDBBtn>
                                                                <MDBModal isOpen={this.state.modalUser} toggle={this.toggleModalUser} centered>
                                                                    <MDBModalHeader toggle={this.toggleModalUser} ></MDBModalHeader>
                                                                    <MDBModalBody className="text-center">
                                                                        <h4>{"Nama :" + elm.User.name}</h4>
                                                                        <h4>{"Kontak :" + elm.User.mobile_number}</h4>
                                                                    </MDBModalBody>
                                                                </MDBModal>
                                                            </td>
                                                            <td valign="bottom"> {elm.Order.time}</td>
                                                            <td valign="bottom"> {elm.Order.created_at}</td>
                                                            <td valign="bottom">
                                                                <MDBBtn style={{ padding: "4px" }}
                                                                    className="button-white  btn btn-lg btn-block rounded-pill"
                                                                    onClick={this.toggleModalAddress}>
                                                                    Lihat
                                                    </MDBBtn>
                                                                <MDBModal isOpen={this.state.modalAddress} toggle={this.toggleModalAddress} centered>
                                                                    <MDBModalHeader toggle={this.toggleModalAddress} ></MDBModalHeader>
                                                                    <MDBModalBody className="text-center">
                                                                        {elm.Order.photo}
                                                                    </MDBModalBody>
                                                                </MDBModal>
                                                            </td>
                                                            <td valign="bottom">
                                                                <MDBBtn style={{ padding: "4px" }}
                                                                    className="button-white  btn btn-lg btn-block rounded-pill"
                                                                    onClick={this.toggleModalPhoto}>
                                                                    Lihat
                                                    </MDBBtn>
                                                                <MDBModal isOpen={this.state.modalPhoto} toggle={this.toggleModalPhoto} centered>
                                                                    <MDBModalHeader toggle={this.toggleModalPhoto} ></MDBModalHeader>
                                                                    <MDBModalBody className="text-center">
                                                                        <img src={elm.Order.photo} alt={elm.Order.photo} />
                                                                    </MDBModalBody>
                                                                </MDBModal>
                                                            </td>
                                                            <td valign="bottom"> <button className="btn btn-lg btn-success btn-block rounded-pill" type="submit" style={{ padding: "4px" }} valign="center" onClick={e => this.confirmOrder(e, elm.Order.id)} >
                                                                Terima
                                                        </button>
                                                            </td>
                                                            <td valign="bottom"> <button className="btn btn-lg btn-danger btn-block rounded-pill" type="submit" style={{ padding: "4px" }} onClick={e => this.rejectOrder(e, elm.Order.id)}>
                                                                Tolak
                                                </button></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </MDBTabPane>
                            <MDBTabPane tabId="2" role="tabpanel">
                                <div className="table-responsive">
                                    <table class="table ">
                                        <thead>
                                            <tr>
                                                <th scope="col">User ID</th>
                                                <th scope="col">Waktu Penjemputan</th>
                                                <th scope="col">Waktu Dibuat</th>
                                                <th scope="col">Alamat</th>
                                                <th scope="col">Foto</th>
                                                <th scope="col">Isi Detail</th>
                                                <th scope="col">Batal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.confirmedOrder.map((elm, key) => {
                                                    return (
                                                        <tr>
                                                            <td valign="bottom">
                                                                <MDBBtn style={{ padding: "4px" }}
                                                                    className="button-white  btn btn-lg btn-block rounded-pill"
                                                                    onClick={this.toggleModalUser}>{elm.Order.user_id}</MDBBtn>
                                                                <MDBModal isOpen={this.state.modalUser} toggle={this.toggleModalUser} centered>
                                                                    <MDBModalHeader toggle={this.toggleModalUser} ></MDBModalHeader>
                                                                    <MDBModalBody className="text-center">
                                                                        <h4>{"Nama :" + elm.User.name}</h4>
                                                                        <h4>{"Kontak :" + elm.User.mobile_number}</h4>
                                                                    </MDBModalBody>
                                                                </MDBModal>
                                                            </td>
                                                            <td valign="bottom"> {elm.Order.time}</td>
                                                            <td valign="bottom">{elm.Order.created_at}</td>
                                                            <td valign="bottom">
                                                                <MDBBtn style={{ padding: "4px" }}
                                                                    className="button-white  btn btn-lg btn-block rounded-pill"
                                                                    onClick={this.toggleModalAddress}>Lihat</MDBBtn>
                                                                <MDBModal isOpen={this.state.modalAddress} toggle={this.toggleModalAddress} centered>
                                                                    <MDBModalHeader toggle={this.toggleModalAddress} ></MDBModalHeader>
                                                                    <MDBModalBody className="text-center">
                                                                        {elm.Order.adress}
                                                                    </MDBModalBody>
                                                                </MDBModal>
                                                            </td>
                                                            <td valign="bottom">
                                                                <MDBBtn style={{ padding: "4px" }}
                                                                    className="button-white  btn btn-lg btn-block rounded-pill"
                                                                    onClick={this.toggleModalPhoto}>Lihat</MDBBtn>
                                                                <MDBModal isOpen={this.state.modalPhoto} toggle={this.toggleModalPhoto} centered>
                                                                    <MDBModalHeader toggle={this.toggleModalPhoto} ></MDBModalHeader>
                                                                    <MDBModalBody className="text-center">
                                                                        <img src={elm.Order.photo} alt={elm.Order.photo} />
                                                                    </MDBModalBody>
                                                                </MDBModal>
                                                            </td>
                                                            <td valign="bottom">
                                                                <Link to={"/order/create/" + elm.Order.id}> <button className="btn btn-lg btn-primary btn-block rounded-pill" type="submit" style={{ padding: "4px" }} valign="center" >
                                                                    Isi Detail
                                                            </button></Link>
                                                            </td>
                                                            <td valign="bottom"> <button className="btn btn-lg btn-danger btn-block rounded-pill" type="submit" style={{ padding: "4px" }} onClick={e => this.rejectOrder(e, elm.Order.id)}>
                                                                Batal
                                                </button></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </MDBTabPane>
                            <MDBTabPane tabId="3" role="tabpanel">
                                <div className="table-responsive">
                                    <table class="table ">
                                        <thead>
                                            <tr>
                                                <th scope="col">User ID</th>
                                                <th scope="col">Waktu Penjemputan</th>
                                                <th scope="col">Waktu Dibuat</th>
                                                <th scope="col">Alamat</th>
                                                <th scope="col">Foto</th>
                                                <th scope="col">Lihat Detail</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.allOrder.map((elm, key) => {
                                                    return (
                                                        <tr>
                                                            <td valign="bottom">
                                                                <MDBBtn style={{ padding: "4px" }}
                                                                    className="button-white  btn btn-lg btn-block rounded-pill"
                                                                    onClick={this.toggleModalUser}>{elm.Order.user_id}</MDBBtn>
                                                                <MDBModal isOpen={this.state.modalUser} toggle={this.toggleModalUser} centered>
                                                                    <MDBModalHeader toggle={this.toggleModalUser} ></MDBModalHeader>
                                                                    <MDBModalBody className="text-center">
                                                                        {/* <h4>{"Nama :" + elm.User.name}</h4> */}
                                                                        {/* <h4>{"Kontak :" + elm.User.mobile_number}</h4> */}
                                                                    </MDBModalBody>
                                                                </MDBModal>
                                                            </td>
                                                            <td valign="bottom"> {elm.Order.time}</td>
                                                            <td valign="bottom"> {elm.Order.created_at}</td>
                                                            <td valign="bottom">
                                                                <MDBBtn style={{ padding: "4px" }}
                                                                    className="button-white  btn btn-lg btn-block rounded-pill"
                                                                    onClick={this.toggleModalAddress}>Lihat</MDBBtn>
                                                                <MDBModal isOpen={this.state.modalAddress} toggle={this.toggleModalAddress} centered>
                                                                    <MDBModalHeader toggle={this.toggleModalAddress} ></MDBModalHeader>
                                                                    <MDBModalBody className="text-center">
                                                                        {elm.Order.adress}
                                                                    </MDBModalBody>
                                                                </MDBModal>
                                                            </td>
                                                            <td valign="bottom">
                                                                <MDBBtn style={{ padding: "4px" }}
                                                                    className="button-white  btn btn-lg btn-block rounded-pill"
                                                                    onClick={this.toggleModalPhoto}>Lihat</MDBBtn>
                                                                <MDBModal isOpen={this.state.modalPhoto} toggle={this.toggleModalPhoto} centered>
                                                                    <MDBModalHeader toggle={this.toggleModalPhoto} ></MDBModalHeader>
                                                                    <MDBModalBody className="text-center">
                                                                        <img src={elm.Order.photo} alt={elm.Order.photo} />
                                                                    </MDBModalBody>
                                                                </MDBModal>
                                                            </td>
                                                            <td valign="bottom"> <Link to={"/order/invoice/" + key}> <button className="btn btn-lg btn-primary btn-block rounded-pill" type="submit" style={{ padding: "4px" }} valign="center" >
                                                                Lihat Detail
                                                        </button></Link>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
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
export default connect("url", actions)(Order);