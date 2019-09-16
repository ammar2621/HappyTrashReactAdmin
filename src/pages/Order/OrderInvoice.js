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
            modalPhoto: false,
            order_invoice: [{ User: { name: null }, Order: { adress: null }, Details: [] }]
        }
    }


    toggleModalPhoto = () => {
        this.setState({
            modalPhoto: !this.state.modalPhoto
        });
    }

    componentDidMount = () => {
        const self = this;
        let config = {
            method: "GET",
            url: self.props.url + "/v1/orders",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("admin_token")
            }
        }
        axios(config)
            .then(async function (response) {
                let order_id = parseInt(self.props.match.params.order_id)
                let order = response.data.filter(function (obj) {
                    return obj.Order.id === order_id
                })
                self.setState({ order_invoice: order })
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
                                            {this.state.order_invoice[0].User.name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bold-text">Alamat</td>
                                        <td>{this.state.order_invoice[0].Order.adress}</td>
                                    </tr>
                                    <tr>
                                        <td className="bold-text">Waktu Penjemputan</td>
                                        <td>{this.state.order_invoice[0].Order.time}</td>
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
                                                    <img src={this.state.order_invoice[0].Order.photo} alt={this.state.order_invoice[0].Order.photo} />
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

                                    {this.state.order_invoice[0].Details.map((elm, key) => {
                                        return (
                                            <tr>
                                                <td valign="bottom">{elm.trash_detail.trash_name}</td>
                                                <td valign="bottom">{elm.qty}</td>
                                                <td valign="bottom">{elm.total_price}</td>
                                                <td valign="bottom">{elm.point}</td>
                                            </tr>
                                        )
                                    })}

                                    <tr>
                                        <th colSpan="1" className="text-right">Total:</th>
                                        <td>{this.state.order_invoice[0].Order.total_qty}</td>
                                        <td>{this.state.order_invoice[0].Order.total_price}</td>
                                        <td>{this.state.order_invoice[0].Order.total_point}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <Link to="/order"> <button id="checkout-button-order" class="btn btn-lg btn-primary btn-block rounded-pill" type="submit">
                            OK
                                    </button></Link> <br />
                    </MDBContainer>
                </div >
            );
        } else {
            return <Redirect to="/login" />
        }
    }
}
export default connect("url", actions)(OrderInvoice);