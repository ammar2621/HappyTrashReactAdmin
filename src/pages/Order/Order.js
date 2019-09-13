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
            modalPhoto: false
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

    toggleModalUser = () => {
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
                                            <tr>
                                                <td valign="bottom">
                                                    <MDBBtn style={{ padding: "4px" }} className=" button-white  btn btn-lg btn-block rounded-pill" onClick={this.toggleModalUser}>
                                                        1
                                                    </MDBBtn>
                                                    <MDBModal isOpen={this.state.modalUser} toggle={this.toggleModalUser} centered>
                                                        <MDBModalHeader toggle={this.toggleModalUser} ></MDBModalHeader>
                                                        <MDBModalBody className="text-center">
                                                            <h4>Nama: Aulia</h4>
                                                            <h4>No HP: 085726317***</h4>
                                                        </MDBModalBody>
                                                    </MDBModal>
                                                </td>
                                                <td valign="bottom"> 24 Maret 2019, 08:00</td>
                                                <td valign="bottom"> tangalseakarang</td>
                                                <td valign="bottom">
                                                    <MDBBtn style={{ padding: "4px" }}
                                                        className="button-white  btn btn-lg btn-block rounded-pill"
                                                        onClick={this.toggleModalAddress}>
                                                        Lihat
                                                    </MDBBtn>
                                                    <MDBModal isOpen={this.state.modalAddress} toggle={this.toggleModalAddress} centered>
                                                        <MDBModalHeader toggle={this.toggleModalAddress} ></MDBModalHeader>
                                                        <MDBModalBody className="text-center">
                                                            GAMBAR PETA
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
                                                            <img src="https://www.w3schools.com/tags/smiley.gif" alt="Gambar" />
                                                        </MDBModalBody>
                                                    </MDBModal>
                                                </td>
                                                <td valign="bottom"> <button className="btn btn-lg btn-success btn-block rounded-pill" type="submit" style={{ padding: "4px" }} valign="center" >
                                                    Terima
                                                        </button>
                                                </td>
                                                <td valign="bottom"> <button className="btn btn-lg btn-danger btn-block rounded-pill" type="submit" style={{ padding: "4px" }}>
                                                    Tolak
                                                </button></td>
                                            </tr>
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
                                            <tr>
                                                <td valign="bottom">
                                                    <MDBBtn style={{ padding: "4px" }}
                                                        className="button-white  btn btn-lg btn-block rounded-pill"
                                                        onClick={this.toggleModalUser}>1</MDBBtn>
                                                    <MDBModal isOpen={this.state.modalUser} toggle={this.toggleModalUser} centered>
                                                        <MDBModalHeader toggle={this.toggleModalUser} ></MDBModalHeader>
                                                        <MDBModalBody className="text-center">
                                                            <h4>Nama: Aulia</h4>
                                                            <h4>No HP: 085726317***</h4>
                                                        </MDBModalBody>
                                                    </MDBModal>
                                                </td>
                                                <td valign="bottom"> 24 Maret 2019, 08:00</td>
                                                <td valign="bottom"> tangalseakarang</td>
                                                <td valign="bottom">
                                                    <MDBBtn style={{ padding: "4px" }}
                                                        className="button-white  btn btn-lg btn-block rounded-pill"
                                                        onClick={this.toggleModalAddress}>Lihat</MDBBtn>
                                                    <MDBModal isOpen={this.state.modalAddress} toggle={this.toggleModalAddress} centered>
                                                        <MDBModalHeader toggle={this.toggleModalAddress} ></MDBModalHeader>
                                                        <MDBModalBody className="text-center">
                                                            INI PETA
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
                                                            <img src="https://www.w3schools.com/tags/smiley.gif" alt="Gambar" />
                                                        </MDBModalBody>
                                                    </MDBModal>
                                                </td>
                                                <td valign="bottom"> <button className="btn btn-lg btn-primary btn-block rounded-pill" type="submit" style={{ padding: "4px" }} valign="center" >
                                                    Isi Detail
                                                        </button>
                                                </td>
                                                <td valign="bottom"> <button className="btn btn-lg btn-danger btn-block rounded-pill" type="submit" style={{ padding: "4px" }}>
                                                    Batal
                                                </button></td>
                                            </tr>
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
                                            <tr>
                                                <td valign="bottom">
                                                    <MDBBtn style={{ padding: "4px" }}
                                                        className="button-white  btn btn-lg btn-block rounded-pill"
                                                        onClick={this.toggleModalUser}>1</MDBBtn>
                                                    <MDBModal isOpen={this.state.modalUser} toggle={this.toggleModalUser} centered>
                                                        <MDBModalHeader toggle={this.toggleModalUser} ></MDBModalHeader>
                                                        <MDBModalBody className="text-center">
                                                            <h4>Nama: Aulia</h4>
                                                            <h4>No HP: 085726317***</h4>
                                                        </MDBModalBody>
                                                    </MDBModal>
                                                </td>
                                                <td valign="bottom"> 24 Maret 2019, 08:00</td>
                                                <td valign="bottom"> tangalseakarang</td>
                                                <td valign="bottom">
                                                    <MDBBtn style={{ padding: "4px" }}
                                                        className="button-white  btn btn-lg btn-block rounded-pill"
                                                        onClick={this.toggleModalAddress}>Lihat</MDBBtn>
                                                    <MDBModal isOpen={this.state.modalAddress} toggle={this.toggleModalAddress} centered>
                                                        <MDBModalHeader toggle={this.toggleModalAddress} ></MDBModalHeader>
                                                        <MDBModalBody className="text-center">
                                                            INI PETA
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
                                                            <img src="https://www.w3schools.com/tags/smiley.gif" alt="Gambar" />
                                                        </MDBModalBody>
                                                    </MDBModal>
                                                </td>
                                                <td valign="bottom"> <button className="btn btn-lg btn-primary btn-block rounded-pill" type="submit" style={{ padding: "4px" }} valign="center" >
                                                    Lihat Detail
                                                        </button>
                                                </td>
                                            </tr>
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
export default Order;