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
import { Redirect, Link } from 'react-router-dom'
import Header from '../../components/Header'
import './Order.css'

class OrderInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalPhoto: false
        }
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
                    <MDBContainer id="bodyreward">
                        <br />
                        <div className="table-responsive">
                            <table class="table ">
                                <thead className="thead-green">
                                    <tr>
                                        <th colSpan="4" scope="col"><h4 className="bold-text">Informasi Klien</h4></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="bold-text">
                                            Nama:
                                        </td>
                                        <td >
                                            Aulia Rahman Hanifan
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bold-text">Alamat</td>
                                        <td>Jalan Tidar</td>
                                    </tr>
                                    <tr>
                                        <td className="bold-text">Waktu Penjemputan</td>
                                        <td>Sekarangbanget</td>
                                    </tr>
                                    <tr>
                                        <td className="bold-text">Foto</td>
                                        <td>
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
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="table-responsive">
                            <table class="table ">
                                <thead className="thead-green">
                                    <tr>
                                        <th colSpan="4" scope="col"><h4 className="bold-text">Informasi Sampah</h4></th>
                                    </tr>
                                    <tr className='thead-white'>
                                        <th scope="col" className="bold-text">Jenis</th>
                                        <th scope="col" className="bold-text">Berat</th>
                                        <th scope="col" className="bold-text">Harga</th>
                                        <th scope="col" className="bold-text">Point</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr>
                                        <td valign="bottom">
                                            Plastik
                                        </td>
                                        <td valign="bottom">
                                            20 kg
                                        </td>
                                        <td valign="bottom">
                                            Rp. 50000
                                        </td>
                                        <td valign="bottom">
                                            20
                                        </td>
                                    </tr>

                                    <tr>
                                        <th colSpan="1" className="text-right">Total:</th>

                                        <td>20 kg</td>
                                        <td>Rp 50000</td>
                                        <td>20</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <button id="checkout-button-order" class="btn btn-lg btn-primary btn-block rounded-pill" type="submit" onClick={e => this.doSubmit(e)}>
                            OK
                                    </button> <br />
                    </MDBContainer>
                </div >
            );
        } else {
            return <Redirect to="/login" />
        }
    }
}
export default OrderInvoice;