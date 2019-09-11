import React, { Component } from "react";
import {
    MDBBtn,
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBInput
} from "mdbreact";
import axios from "axios";
import { connect } from "unistore/react";
import { actions } from "../../store";
import { Redirect, Link } from 'react-router-dom'
import Header from '../../components/Header'
import OrderImage from './img/tracking.png'
import CategoryImage from './img/list.png'
import TrashImage from './img/plastic-bag.png'
import RewardImage from './img/medal.png'
import './Home.css'

class Home extends Component {
    constructor(props) {
        super(props);
    }


    render() {

        if (localStorage.getItem('admin_logged_in') == 'true') {
            return (
                <div style={{ height: "100vh" }} >
                    <Header />
                    <MDBContainer id="home" style={{ height: "100vh" }} fluid>
                        <MDBRow center='true' className="justify-content-center">
                            <MDBCol md="6" className="text-center" >
                                <br />
                                <h1 className="text-center">Admin Dasbor</h1>
                                <h2 className="text-center">Silakan Pilih Menu</h2>
                                <br />
                                <MDBBtn className="rounded-pill menubutton" type="submit">
                                    <img
                                        class=""
                                        src={OrderImage}
                                        alt="Order"
                                        height="40px"
                                    />&nbsp; Order</MDBBtn>
                                <br />
                                <MDBBtn className="rounded-pill menubutton" type="submit">
                                    <img
                                        class=""
                                        src={CategoryImage}
                                        alt="Category"
                                        height="40px"
                                    />&nbsp; Kategori</MDBBtn>
                                <br />
                                <MDBBtn className="rounded-pill menubutton" type="submit">
                                    <img
                                        class=""
                                        src={TrashImage}
                                        alt="Order"
                                        height="40px"
                                    /> Jenis Sampah</MDBBtn>
                                <br />
                                <MDBBtn className="rounded-pill menubutton" type="submit"> <img
                                    class=""
                                    src={RewardImage}
                                    alt="Order"
                                    height="40px"
                                />&nbsp; Hadiah </MDBBtn>
                                <br />

                            </MDBCol>
                        </MDBRow>
                    </MDBContainer >

                </div >
            );
        } else {
            return <Redirect to="/login" />
        }
    }
}

export default Home;
