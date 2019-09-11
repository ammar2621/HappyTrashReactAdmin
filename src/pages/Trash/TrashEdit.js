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

class Trash extends Component {
    state = {
        activeItem: "1"
    }
    constructor(props) {
        super(props);
        this.name = React.createRef();
        this.imageURL = React.createRef();
        this.price = React.createRef();
        this.point = React.createRef();
        this.categoryID = React.createRef();
    }


    toggle = tab => e => {
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
        }
    };

    render() {
        if (localStorage.getItem('admin_logged_in') == 'true') {
            return (
                <div style={{ height: "100vh" }}>
                    <Header />
                    <MDBContainer>
                        <br />
                        <h2>Edit Sampah</h2>
                        <form class="form-signin">
                            <label for="inputName" class="sr-only">
                                Name
                                    </label>
                            <input
                                type="text"
                                id="inputName"
                                class="form-control"
                                placeholder="Nama"

                            />
                            <br />
                            <label for="inputPhotoURL" class="sr-only">
                                PhotoURL
                                    </label>
                            <input
                                type="text"
                                id="inputPhotoURL"
                                class="form-control"
                                placeholder="URL Gambar"

                            />
                            <br />
                            <label for="inputStock" class="sr-only">
                                ID Kategori
                                    </label>
                            <input
                                type="number"
                                id="inputStock"
                                class="form-control"
                                placeholder="ID Kategory"

                            />
                            <br />
                            <label for="inputPrice" class="sr-only">
                                Price
                                    </label>
                            <input
                                type="number"
                                id="inputPrice"
                                class="form-control"
                                placeholder="Harga"

                            />
                            <br />
                            <label for="inputPoint" class="sr-only">
                                Point
                                    </label>
                            <input
                                type="Number"
                                id="inputPoint"
                                class="form-control"
                                placeholder="Poin"

                            />
                            <br />


                            <button class="btn btn-lg btn-primary btn-block rounded-pill" type="submit" style={{ padding: "6px" }}>
                                Edit
                  </button>

                        </form>
                    </MDBContainer>
                </div >
            );
        } else {
            return <Redirect to="/login" />
        }
    }
}
export default Trash;