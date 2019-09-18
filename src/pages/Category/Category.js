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
import './Category.css'
import Garbage from './img/garbage.png'
import Swal from 'sweetalert2'

class Category extends Component {

    constructor(props) {
        super(props);
        this.name = React.createRef();
        this.doSubmit = this.doSubmit.bind(this);
        this.state = {
            activeItem: "1",
            categories: [],
            status: []
        }
    }

    // function to filter the active/non-active category
    statusFilter = async e => {
        e.preventDefault();
        const self = this;
        if (e.target.value == '0') {
            // to get the non-active trashes 
            await axios
                .get(this.props.url + `/v1/trash_category`,
                    {
                        headers: {
                            Authorization: "Bearer " + String(localStorage.getItem('admin_token'))
                        }
                    })
                .then(async response => {
                    await this.setState({ categories: [], status: [] })
                    await response.data.map((item, index) => {
                        if (item.status === false) {
                            const joined = this.state.categories.concat(item);
                            this.setState({ categories: joined })
                        }
                    })
                    await this.state.categories.map((item, index) => {
                        if (item.status === false) {
                            const joined = this.state.status.concat('Tidak Aktif');
                            this.setState({ status: joined })
                        } else if (item.status === true) {
                            const joined = this.state.status.concat('Aktif');
                            this.setState({ status: joined })
                        }
                    })
                })
                .catch(error => {
                });
        } else if (e.target.value == '1') {
            // to get the active trashes 
            await axios
                .get(this.props.url + `/v1/trash_category`,
                    {
                        headers: {
                            Authorization: "Bearer " + String(localStorage.getItem('admin_token'))
                        }
                    })
                .then(async response => {
                    await this.setState({ categories: [], status: [] })
                    await response.data.map((item, index) => {
                        if (item.status === true) {
                            const joined = this.state.categories.concat(item);
                            this.setState({ categories: joined })
                        }
                    })
                    await this.state.categories.map((item, index) => {
                        if (item.status === false) {
                            const joined = this.state.status.concat('Tidak Aktif');
                            this.setState({ status: joined })
                        } else if (item.status === true) {
                            const joined = this.state.status.concat('Aktif');
                            this.setState({ status: joined })
                        }
                    })
                })
                .catch(error => {
                });
        } else if (e.target.value == '2') {
            // to get the all trashes 
            self.setState({ categories: [], status: [] })
            self.componentDidMount();
        }
    }

    // function to make tab works
    toggle = tab => e => {
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
        }
    };

    // function to submit/add category to database
    doSubmit = e => {
        e.preventDefault();
        const regex = /^[^\s]+(\s+[^\s]+)*$/;
        if (!regex.test(this.name.current.value) | this.name.current.value === "") {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Jangan spasi/kosong!!'
            })
            return false;
        }
        const self = this;
        let config = {
            method: "POST",
            url: self.props.url + "/v1/trash_category",
            data: {
                category_name: self.name.current.value
            },
            headers: {
                Authorization: "Bearer " + localStorage.getItem("admin_token")
            }
        };
        axios(config).then(function (response) {
            Swal.fire({
                type: 'success',
                title: 'Success',
                text: 'Berhasil Menambahkan Kategori'
            })
            self.name.current.value = ""
            self.componentDidMount()
        }).catch(function (error) {
        })
    }

    // function that works after react rendered/mounted
    componentDidMount = () => {
        const self = this;
        let config = {
            method: "GET",
            url: self.props.url + "/v1/trash_category",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("admin_token")
            }
        }
        axios(config).then(async (response) => {
            await self.setState({ categories: response.data })
            await response.data.map((item, index) => {
                if (item.status === false) {
                    const joined = this.state.status.concat('Tidak Aktif');
                    this.setState({ status: joined })
                } else if (item.status === true) {
                    const joined = this.state.status.concat('Aktif');
                    this.setState({ status: joined })
                }
            })
        }).catch(function (error) {
        })
    }

    // function to delete category from database
    deleteCategory = (e, id) => {
        e.preventDefault();
        const self = this;
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })
        // making the confirmaton first before it deleted
        swalWithBootstrapButtons.fire({
            title: 'Apakah anda yakin?',
            text: "Anda tidak bisa mengembalikan ketika sudah dihapus",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus saja!!',
            cancelButtonText: 'Tidak!',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                let config = {
                    method: "DELETE",
                    url: self.props.url + "/v1/trash_category/" + id,
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("admin_token")
                    }
                }
                axios(config)
                    .then(function (response) {
                        self.componentDidMount()
                    })
                    .catch(function (error) {
                    })
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Tidak Jadi',
                    'Tetap aman :)',
                    'error'
                )
            }
        })
    }

    render() {
        if (localStorage.getItem('admin_logged_in') == 'true') {
            return (
                <div style={{ height: "100vh" }}>
                    <Header />
                    <MDBContainer>
                        <br />
                        <h2 style={{ fontWeight: '700' }}>Pengaturan Kategori</h2>
                        <MDBNav className="nav-tabs ">
                            <MDBNavItem>
                                <MDBNavLink
                                    style={{ color: 'black' }}
                                    active={this.state.activeItem === "1"}
                                    onClick={this.toggle("1")}
                                    role="tab"
                                >
                                    Tambah Kategori
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink
                                    style={{ color: 'black' }}
                                    active={this.state.activeItem === "2"}
                                    onClick={this.toggle("2")}
                                    role="tab"
                                >
                                    List Kategori
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
                                        ref={this.name}

                                    />
                                    <br />
                                    <button class="btn button-green btn-lg btn-primary btn-block rounded-pill" type="submit" onClick={e => this.doSubmit(e)}>
                                        Tambah
                                    </button>
                                </form>
                            </MDBTabPane>
                            <MDBTabPane tabId="2" role="tabpanel">
                                <br />
                                <p style={{ fontWeight: '700', display: 'inline-block' }} > Status Kategori: &nbsp;</p>
                                <select
                                    style={{ maxWidth: '120px', display: 'inline-block', fontWeight: '700' }}
                                    className="form-control"
                                    onChange={e => this.statusFilter(e)}
                                >
                                    <option value='2'> Semua</option>
                                    <option value='1'> Aktif</option>
                                    <option value='0'> Non-Aktif</option>
                                </select>
                                <div className="table-responsive">
                                    <table class="table ">
                                        <thead>
                                            <tr>
                                                <th scope="col">No</th>
                                                <th scope="col">Nama</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Edit</th>
                                                <th scope="col">Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.categories.map((elm, key) => {
                                                return (
                                                    <tr>
                                                        <td valign="bottom"> {key + 1}</td>
                                                        <td valign="bottom"> {elm.category_name}</td>                                                                                    <td valign="bottom"> {this.state.status[key]}</td>
                                                        <td valign="bottom">
                                                            <Link to={"/category/edit/" + elm.id}>
                                                                <button className="btn button-green btn-lg btn-primary btn-block rounded-pill" type="submit" style={{ padding: "4px" }} valign="center"
                                                                >
                                                                    Edit
                                                        </button>
                                                            </Link>
                                                        </td>
                                                        <td valign="bottom">
                                                            <a onClick={e => this.deleteCategory(e, elm.id)}>
                                                                <img src={Garbage} style={{ height: '30px' }} />
                                                            </a>
                                                        </td>
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

export default connect("url", actions)(Category);