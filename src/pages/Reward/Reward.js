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
import './Reward.css'

class Reward extends Component {
    state = {
        activeItem: "1",
        modal: false
    }

    constructor(props) {
        super(props);
        this.name = React.createRef();
        this.imageURL = React.createRef();
        this.price = React.createRef();
        this.point = React.createRef();
        this.categoryID = React.createRef();
        this.state = {
            rewards: [],
            histories: []
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

    deleteReward = (e, id) => {
        e.preventDefault();
        const self = this;
        let config = {
            method: "PUT",
            url: self.props.url + "/v1/rewards/" + id,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("admin_token")
            },
            data: { 'status': false }
        }
        axios(config)
            .then(function (response) {
                console.log(response.status);
                self.componentDidMount()
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    componentDidMount() {
        const self = this;
        let config_reward = {
            method: "GET",
            url: self.props.url + "/v1/rewards",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("admin_token")
            }
        }

        let config_history = {
            method: "GET",
            url: self.props.url + "/v1/reward_history",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("admin_token")
            }
        }

        axios(config_reward)
            .then(function (response) {
                console.log(response);
                self.setState({ rewards: response.data })

            })
            .catch(function (error) {
                console.log(error)
            })

        axios(config_history)
            .then(function (response) {
                console.log(response);
                self.setState({ histories: response.data })

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
                    <MDBContainer id="bodyreward" style={{ height: "100vh" }}>
                        <br />
                        <h2 id="titlereward">Pengaturan Hadiah</h2>
                        <MDBNav className="nav-tabs ">
                            <MDBNavItem>
                                <MDBNavLink className="tab-reward" active={this.state.activeItem === "1"} onClick={this.toggle("1")} role="tab" >
                                    Tambah Hadiah
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink className="tab-reward" active={this.state.activeItem === "2"} onClick={this.toggle("2")} role="tab" >
                                    List Hadiah
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink className="tab-reward" active={this.state.activeItem === "3"} onClick={this.toggle("3")} role="tab" >
                                    Penerima Hadiah
                                </MDBNavLink>
                            </MDBNavItem>
                        </MDBNav>
                        <MDBTabContent activeItem={this.state.activeItem} >
                            <MDBTabPane tabId="1" role="tabpanel">
                                <br />
                                <form class="form-signin">
                                    <label for="inputName" >
                                        Nama:
                                    </label>
                                    <input
                                        type="text"
                                        id="inputName"
                                        class="form-control"
                                        placeholder="Nama"
                                    />
                                    <br />
                                    <label for="inputPoint  " >
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
                                    <label for="inputStock" >
                                        Stok:
                                    </label>
                                    <input
                                        type="number"
                                        id="inputStock"
                                        class="form-control"
                                        placeholder="Stok"
                                        min="1"
                                    />
                                    <br />
                                    <label for="inputPhoto" >
                                        Upload Foto:
                                    </label> <br />
                                    <progress value="30" max="100" style={{ width: "100%" }} /> <br />
                                    <input className="" type="file" placeholder="Upload Gambar" /> <br />  <br />
                                    <button id="addbuttonreward" class="btn btn-lg btn-primary btn-block rounded-pill" type="submit" onClick={e => this.doSubmit(e)}>
                                        Tambah
                                    </button> <br />

                                </form>
                            </MDBTabPane>
                            <MDBTabPane tabId="2" role="tabpanel">
                                <div className="table-responsive">
                                    <table class="table ">
                                        <thead>
                                            <tr>
                                                <th scope="col">ID</th>
                                                <th scope="col">Nama</th>
                                                <th scope="col">Poin</th>
                                                <th scope="col">Stok</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Waktu Dibuat</th>
                                                <th scope="col">Waktu Diubah</th>
                                                <th scope="col">Foto</th>
                                                <th scope="col">Ubah</th>
                                                <th scope="col">Hapus</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.rewards.map((elm, key) => {
                                                return (
                                                    <tr>
                                                        <td valign="bottom"> {elm.id}</td>
                                                        <td valign="bottom"> {elm.name}</td>
                                                        <td valign="bottom"> {elm.point_to_claim}</td>
                                                        <td valign="bottom"> {elm.stock} Pcs</td>
                                                        <td valign="bottom"> {elm.status}</td>
                                                        <td valign="bottom"> {elm.date_created}</td>
                                                        <td valign="bottom"> {elm.date_modified}</td>
                                                        <td valign="bottom">
                                                            <MDBBtn style={{ padding: "4px" }} className="button-view-image-reward  btn btn-lg btn-block rounded-pill" onClick={this.toggleModal}>Lihat</MDBBtn>
                                                            <MDBModal isOpen={this.state.modal} toggle={this.toggleModal} centered>
                                                                <MDBModalHeader toggle={this.toggleModal} ></MDBModalHeader>
                                                                <MDBModalBody className="text-center">
                                                                    <img src={elm.photo} alt={elm.photo} />
                                                                </MDBModalBody>
                                                            </MDBModal>
                                                        </td>
                                                        <td valign="bottom">
                                                            <Link to={"/reward/edit/" + elm.id}> <button className="btn btn-lg btn-primary btn-block rounded-pill" type="submit" style={{ padding: "4px" }} valign="center" >
                                                                Ubah
                                                        </button></Link>
                                                        </td>
                                                        <td valign="bottom">
                                                            <button className="btn btn-lg btn-danger btn-block rounded-pill" type="submit" style={{ padding: "4px" }} onClick={e => this.deleteReward(e, elm.id)}>
                                                                Hapus
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </MDBTabPane>
                            <MDBTabPane tabId="3" role="tabpanel">
                                <div className="table-responsive">
                                    <table class="table ">
                                        <thead>
                                            <tr>
                                                <th scope="col">No</th>
                                                <th scope="col">ID Redeem</th>
                                                <th scope="col">Nama</th>
                                                <th scope="col">Hadiah</th>
                                                <th scope="col">Waktu</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.histories.map((elm, key) => {
                                                return (
                                                    <tr>
                                                        <td valign="bottom"> {key + 1}</td>
                                                        <td valign="bottom"> {elm.id}</td>
                                                        <td valign="bottom"> {elm.user.name} </td>
                                                        <td valign="bottom"> {elm.reward_name}</td>
                                                        <td valign="bottom"> {elm.created_at}</td>
                                                    </tr>
                                                )
                                            })}
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
export default connect("url", actions)(Reward);