import React, { Component } from "react";
import {
    MDBContainer,
    MDBTabPane,
    MDBTabContent,
    MDBNav,
    MDBNavItem,
    MDBNavLink,
    MDBBtn
} from "mdbreact";
import axios from "axios";
import { connect } from "unistore/react";
import { actions } from "../../store";
import { Redirect, Link } from 'react-router-dom'
import Header from '../../components/Header'
import './Trash.css'
import Swal from 'sweetalert2'
import { storage } from "../../firebase/index";

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
            category: [],
            photo: null,
            urlPhoto: "",
            progress: 0
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

    // funtion to store photo uploaded by user
    handleChangePhoto = e => {
        if (e.target.files[0]) {
            this.state.photo = e.target.files[0];
            console.log(e.target.files[0])
        }
    };

    // function to upload photo to cloud storage
    handleUploadPhoto = event => {
        event.preventDefault();
        try {
            const uploadTask = storage
                .ref(`images/${this.state.photo.name}`)
                .put(this.state.photo);
            uploadTask.on(
                "state_changed",
                snapshot => {
                    //progress Function
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    this.setState({ progress });
                },
                error => {
                    console.log(error);
                },
                () => {
                    //Complete Function
                    storage
                        .ref("images")
                        .child(this.state.photo.name)
                        .getDownloadURL()
                        .then(url => {
                            this.setState({ urlPhoto: url });
                            console.log(this.state.urlPhoto);
                        });
                }
            );
        } catch (err) {
            console.log("File Kosong");
        }
    };

    // function to post the trash
    doAddTrash = async e => {
        e.preventDefault();
        const regex_number = /^\d+$/;
        const regex_name = /^[a-zA-Z ]{2,30}$/;;
        // check the name validation
        if (!regex_name.test(this.name.current.value)) {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Gunakan Huruf Untuk Nama (Minimal 2 Huruf)!'
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
        }
        const self = this;
        await axios
            .post(this.props.url + `/v1/trash`,
                {
                    trash_category_id: Number(this.category.current.value),
                    trash_name: this.name.current.value,
                    price: Number(this.price.current.value),
                    photo: this.state.urlPhoto,
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

    // Function to pop up image
    openImage = (e, url) => {
        Swal.fire({
            html: `<img src=${url} style='max-width: 480px' class="text-center">`
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
                                    <label for="inputStock">
                                        Kategori:
                                    </label>
                                    <select ref={this.category} class="form-control" id="status pembayaran">
                                        {this.state.category.map((item, index) => {
                                            return (
                                                <option
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
                                    <label for="inputPhotoURL">Pilih Foto Lalu Klik Upload</label>
                                    <br />
                                    <progress value={this.state.progress} max="100" style={{ width: "100%" }} />
                                    <br />
                                    <input type="file" onChange={this.handleChangePhoto} />
                                    <image src={this.state.photo} />
                                    <br />
                                    <br />
                                    <button onClick={this.handleUploadPhoto}>Upload</button>
                                    <br />
                                    <br />
                                    <button class="add-button-trash btn btn-lg btn-primary btn-block rounded-pill" type="submit" onClick={e => this.doAddTrash(e)}>
                                        Tambah
                                    </button>
                                    <br />
                                    <br />
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
                                                            <MDBBtn style={{ padding: "4px" }}
                                                                className="button-white  btn btn-lg btn-block rounded-pill"
                                                                onClick={e => this.openImage(e, item.photo)}
                                                            >
                                                                Lihat
                                                            </MDBBtn>
                                                        </td>
                                                        <td valign="bottom"> {item.point}</td>
                                                        <td valign="bottom"> Rp. {item.price}</td>
                                                        <td valign="bottom"> {item.created_at.slice(0, 26)}</td>
                                                        <td valign="bottom"> {item.updated_at.slice(0, 26)}</td>
                                                        <td valign="bottom">

                                                            <Link to={"/trash/edit/" + item.id}><button className="btn btn-lg btn-primary btn-block rounded-pill" type="submit" style={{ padding: "4px" }} valign="center"
                                                            >
                                                                Edit
                                                        </button>
                                                            </Link>
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