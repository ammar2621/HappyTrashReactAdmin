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

class OrderDetailsCheckout extends Component {
    constructor(props) {
        super(props);
        this.name = React.createRef();
        this.imageURL = React.createRef();
        this.price = React.createRef();
        this.point = React.createRef();
        this.categoryID = React.createRef();
    }

    render() {
        if (localStorage.getItem('admin_logged_in') == 'true') {
            return (
                <div style={{ height: "100vh" }}>
                    <Header />
                    <MDBContainer id="bodyreward">
                        <br />
                        <h2 id="titlerewardedit">Checkout</h2>
                        <h4>Nama: Aulia Rahman</h4>
                        <div className="table-responsive">
                            <table class="table ">
                                <thead>
                                    <tr>
                                        <th scope="col">Jenis Sampah</th>
                                        <th scope="col">Berat</th>
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
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <button id="checkout-button-order" class="btn btn-lg btn-primary btn-block rounded-pill" type="submit" >
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
export default OrderDetailsCheckout;