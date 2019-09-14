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
        this.image = React.createRef();
        this.stock = React.createRef();
        this.point = React.createRef();
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
                        <h2>Pengaturan Sampah</h2>
                        <MDBNav className="nav-tabs ">
                            <MDBNavItem>
                                <MDBNavLink active={this.state.activeItem === "1"} onClick={this.toggle("1")} role="tab" >
                                    Tambah Sampah
            </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink active={this.state.activeItem === "2"} onClick={this.toggle("2")} role="tab" >
                                    List Sampah
            </MDBNavLink>
                            </MDBNavItem>
                        </MDBNav>
                        <MDBTabContent activeItem={this.state.activeItem} >
                            <MDBTabPane tabId="1" role="tabpanel">
                                <br />
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


                                    <button class="btn btn-lg btn-primary btn-block rounded-pill" type="submit" onClick={e => this.doSubmit(e)}>
                                        Add
                  </button>

                                </form>
                            </MDBTabPane>
                            <MDBTabPane tabId="2" role="tabpanel">
                                <div className="table-responsive">
                                    <table class="table ">
                                        <thead>
                                            <tr>
                                                <th scope="col">ID Sampah</th>
                                                <th scope="col">ID Kategori</th>
                                                <th scope="col">Nama</th>
                                                <th scope="col">URL Foto</th>
                                                <th scope="col">Poin</th>
                                                <th scope="col">Harga</th>
                                                <th scope="col">Created At</th>
                                                <th scope="col">Updated At</th>
                                                <th scope="col">Edit</th>
                                                <th scope="col">Delete</th>



                                            </tr>
                                        </thead>
                                        <tbody>


                                            <tr>
                                                <td valign="bottom"> 1</td>
                                                <td valign="bottom"> 1</td>
                                                <td valign="bottom"> Plastik</td>
                                                <td valign="bottom"> http</td>
                                                <td valign="bottom"> 1</td>
                                                <td valign="bottom"> Rp. X</td>
                                                <td valign="bottom"> tanggalsekarang</td>
                                                <td valign="bottom"> tanggalsekarang</td>
                                                <td valign="bottom"> <button className="btn btn-lg btn-primary btn-block rounded-pill" type="submit" style={{ padding: "4px" }} valign="center" >
                                                    Change
                                                        </button>
                                                </td>
                                                <td valign="bottom"> <button className="btn btn-lg btn-danger btn-block rounded-pill" type="submit" style={{ padding: "4px" }}>
                                                    Delete
                                                </button></td>
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
export default connect('url', actions)(Trash);