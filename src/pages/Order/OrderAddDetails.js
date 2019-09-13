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

                            <select class="form-control" id="status pembayaran">
                                <option value="0"> Plastik Campuran</option>
                                <option value="10"> Plastik Bersih</option>
                                <option value="20">Kardus</option>
                                <option value="30">Koran</option>
                                <option value="98">Besi</option>
                                <option value="99">Besi</option>
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
                            />
                            <br />
                            <button id="add-button-order" class="btn btn-lg btn-primary btn-block rounded-pill" type="submit" onClick={e => this.doSubmit(e)}>
                                Tambah Sampah Lagi
                                    </button> <br />

                            <button id="checkout-button-order" class="btn btn-lg btn-primary btn-block rounded-pill" type="submit" onClick={e => this.doSubmit(e)}>
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
export default OrderAddDetails;