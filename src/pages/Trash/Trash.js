import React, { Component } from "react";
import {
    MDBContainer,
    MDBTabPane,
    MDBTabContent,
    MDBNav,
    MDBNavItem,
    MDBNavLink,
    MDBBtn,
    MDBModal,
    MDBModalBody,
    MDBModalHeader
} from "mdbreact";
import axios from "axios";
import { connect } from "unistore/react";
import { actions } from "../../store";
import { Redirect, Link } from 'react-router-dom'
import Header from '../../components/Header'
import './Trash.css'
import Swal from 'sweetalert2'

class Trash extends Component {
    constructor(props) {
        super(props);
        this.name = React.createRef();
        this.photo = React.createRef();
        this.price = React.createRef();
        this.point = React.createRef();
        this.category = React.createRef();
        this.state = {
            activeItem: "1",
            trash: [],
            modalPhoto: false,
            category: []
        }
    }

    // function to make modal operate
    toggle = tab => e => {
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
        }
    };

    // function to pop up the picture/photo
    toggleModalPhoto = () => {
        this.setState({
            modalPhoto: !this.state.modalPhoto
        });
    }

    // function to post the trash
    doAddTrash = async e => {
        e.preventDefault();
        const regex_http = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
        const regex_number = /^\d+$/;
        const regex_name = /^[a-zA-Z ]{2,30}$/;;
        // check the name validation
        if (!regex_name.test(this.name.current.value)) {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Gunakan Huruf Untuk Nama!'
            })
            return false
        } else if (!regex_number.test(this.point.current.value)) {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Gunakan Angka Untuk Poin!'
            })
            return false
        } else if (!regex_number.test(this.price.current.value)) {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Gunakan Angka Untuk Harga!'
            })
            return false
        } else if (!regex_number.test(this.category.current.value)) {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Gunakan Angka untuk Kategori!'
            })
            return false
        } else if (!regex_http.test(this.photo.current.value)) {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Gunakan Format URL yang Benar! (https://blabla.com/contoh.png)'
            })
            return false
        }
        const self = this;
        await axios
            .post(this.props.url + `/v1/trash`,
                {
                    trash_category_id: this.category.current.value,
                    trash_name: this.name.current.value,
                    price: Number(this.price.current.value),
                    photo: this.photo.current.value,
                    point: Number(this.point.current.value)
                },
                {
                    headers: {
                        Authorization: "Bearer " + String(localStorage.getItem('admin_token'))
                    }
                })
            .then(response => {
                console.log(response.data)
                Swal.fire({
                    type: 'success',
                    title: 'Success',
                    text: 'Berhasil Menambahkan Jenis Sampah!'
                })
                this.name.current.value = ' '
                this.category.current.value = ' '
                this.price.current.value = ' '
                this.point.current.value = ' '
                this.photo.current.value = ' '
                self.componentDidMount();
            })
            .catch(error => {
            });
    }

    // function to delete trash from database
    deleteTrash = (e, id) => {
        e.preventDefault();
        const self = this;
        let config = {
            method: "DELETE",
            url: self.props.url + `/v1/trash/${id}`,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("admin_token")
            }
        }
        axios(config)
            .then(function (response) {
                Swal.fire({
                    type: 'success',
                    title: 'Success',
                    text: 'Berhasil Menghapus Jenis Sampah!'
                })
                self.componentDidMount()
            })
            .catch(function (error) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops....',
                    text: 'Terjadi kesalahan!'
                })
            })
    }


    // function operate after renderred, to get the list of trashes and category of trashes
    componentDidMount = async () => {
        const self = this;
        // to get the all trashes 
        await axios
            .get(this.props.url + `/v1/trash`,
                {
                    headers: {
                        Authorization: "Bearer " + String(localStorage.getItem('admin_token'))
                    }
                })
            .then(response => {
                this.setState({ trash: response.data })
            })
            .catch(error => {
            });
        // to get all categories
        await axios
            .get(this.props.url + '/v1/trash_category',
                {
                    headers: {
                        Authorization: "Bearer " + String(localStorage.getItem('admin_token'))
                    }
                })
            .then(response => {
                this.setState({ category: response.data })
            })
            .catch(error => {
            });
    }

    render() {
        if (localStorage.getItem('admin_logged_in') == 'true') {
            return (
                <div style={{ height: "100vh" }}>
                    <Header />
                    <MDBContainer>
                        <br />
                        <h2 className="title-of-page">Pengaturan Sampah</h2>
                        <MDBNav className="nav-tabs ">
                            <MDBNavItem>
                                <MDBNavLink className='black-font' active={this.state.activeItem === "1"} onClick={this.toggle("1")} role="tab" >
                                    Tambah Sampah
            </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink className='black-font' active={this.state.activeItem === "2"} onClick={this.toggle("2")} role="tab" >
                                    List Sampah
            </MDBNavLink>
                            </MDBNavItem>
                        </MDBNav>
                        <MDBTabContent activeItem={this.state.activeItem} >
                            <MDBTabPane tabId="1" role="tabpanel">
                                <br />
                                <form class="form-signin">
                                    <label for="inputName">
                                        Nama:
                                    </label>
                                    <input
                                        type="text"
                                        id="inputName"
                                        class="form-control"
                                        placeholder="Nama"
                                        required='required'
                                        ref={this.name}
                                    />
                                    <br />
                                    <label for="inputPhotoURL">
                                        PhotoURL:
                                    </label>
                                    <input
                                        type="text"
                                        id="inputPhotoURL"
                                        class="form-control"
                                        placeholder="URL Gambar"
                                        required='required'
                                        ref={this.photo}
                                    />
                                    <br />
                                    <label for="inputStock">
                                        Kategori:
                                    </label>
                                    <select class="form-control" id="status pembayaran">
                                        {this.state.category.map((item, index) => {
                                            return (
                                                <option
                                                    ref={this.category}
                                                    value={item.id}> {item.category_name}</option>
                                            )
                                        })}
                                    </select>
                                    <br />
                                    <label for="inputPrice">
                                        Harga (dalam rupiah):
                                    </label>
                                    <input
                                        type="number"
                                        id="inputPrice"
                                        class="form-control"
                                        placeholder="Harga"
                                        min="0"
                                        step="100"
                                        required='required'
                                        ref={this.price}
                                    />
                                    <br />
                                    <label for="inputPoint">
                                        Poin:
                                    </label>
                                    <input
                                        type="Number"
                                        id="inputPoint"
                                        class="form-control"
                                        placeholder="Poin"
                                        min="1"
                                        required='required'
                                        ref={this.point}
                                    />
                                    <br />
                                    <button class="add-button-trash btn btn-lg btn-primary btn-block rounded-pill" type="submit" onClick={e => this.doAddTrash(e)}>
                                        Tambah
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
                                                <th scope="col">Gambar</th>
                                                <th scope="col">Poin</th>
                                                <th scope="col">Harga</th>
                                                <th scope="col">Created At</th>
                                                <th scope="col">Updated At</th>
                                                <th scope="col">Edit</th>
                                                <th scope="col">Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.trash.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td valign="bottom"> {item.id}</td>
                                                        <td valign="bottom"> {item.trash_category_id}</td>
                                                        <td valign="bottom"> {item.trash_name}</td>
                                                        <td valign="bottom">
                                                            <a href={item.photo} >
                                                                <MDBBtn style={{ padding: "4px" }}
                                                                    className="button-white  btn btn-lg btn-block rounded-pill"
                                                                >
                                                                    Lihat
                                                            </MDBBtn>
                                                            </a>
                                                        </td>
                                                        <td valign="bottom"> {item.point}</td>
                                                        <td valign="bottom"> Rp. {item.price}</td>
                                                        <td valign="bottom"> {item.created_at.slice(0, 26)}</td>
                                                        <td valign="bottom"> {item.updated_at.slice(0, 26)}</td>
                                                        <td valign="bottom"> <button className="btn btn-lg btn-primary btn-block rounded-pill" type="submit" style={{ padding: "4px" }} valign="center" >
                                                            Change
                                                        </button>
                                                        </td>
                                                        <td valign="bottom">
                                                            <button className="btn btn-lg btn-danger btn-block rounded-pill"
                                                                type="submit"
                                                                style={{ padding: "4px" }}
                                                                onClick={e => this.deleteTrash(e, item.id)}>
                                                                Delete
                                                </button></td>
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

export default connect('url', actions)(Trash);