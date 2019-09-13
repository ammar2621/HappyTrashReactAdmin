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
                        <h2 id="titlerewardedit">Edit Hadiah</h2>
                        <form class="form-signin">
                            <label for="inputName">
                                Nama:
                                    </label>
                            <input
                                type="text"
                                id="inputName"
                                class="form-control"
                                placeholder="Nama"

                            />
                            <br />
                            <label for="inputPoint  ">
                                Poin:
                                    </label>
                            <input
                                type="number"
                                id="inputPoint  "
                                class="form-control"
                                placeholder="Nilai Poin"
                                min="1"
                            />
                            <br />
                            <label for="inputStock">
                                Stok:
                                    </label>
                            <input
                                type="number"
                                id="inputStock"
                                class="form-control"
                                placeholder="Stok"
                                min="0"
                            />
                            <br />
                            <label for="inputPhoto" >
                                Upload Foto (Jika Ingin Diubah):
                                    </label> <br />
                            <progress value="0" max="100" style={{ width: "100%" }} /> <br />
                            <input className="" type="file" placeholder="Upload Gambar" /> <br />  <br />
                            <button id="addbuttonreward" class="btn btn-lg btn-primary btn-block rounded-pill" type="submit" onClick={e => this.doSubmit(e)}>
                                Edit
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
export default OrderDetailsCheckout;