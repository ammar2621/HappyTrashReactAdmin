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
import {
    Redirect,
    Link
} from 'react-router-dom'
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
            photo: "",
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
            this.componentDidMount();
        }
    };

    // funtion to store photo uploaded by user
    handleChangePhoto = e => {
        e.preventDefault();
        const regexImage = /([/|.|\w|\s|-])*\.(?:jpg|gif|png)/;
        if (!regexImage.test(e.target.files[0].name)) {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Gunakan ekstensi .jpg .png atau .gif saja! '
            })
            return false;
        } else if (e.target.files[0]) {
            if (e.target.files[0].size < 10000000) {
                this.setState({ photo: e.target.files[0] })
                console.log(e.target.files[0])
                try {
                    const uploadTask = storage
                        .ref(`images/${e.target.files[0].name}`)
                        .put(e.target.files[0]);
                    uploadTask.on(
                        "state_changed",
                        snapshot => {
                            //progress Function
                            const progress =
                                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            this.setState({ progress });
                        },
                        error => {
                        },
                        () => {
                            //Complete Function
                            storage
                                .ref("images")
                                .child(this.state.photo.name)
                                .getDownloadURL()
                                .then(url => {
                                    console.log(url)
                                    this.setState({ urlPhoto: url });
                                });
                        }
                    );
                } catch (err) {
                }
            } else {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Maksimal file 10!'
                })
            }
        }
    };

    // function to post the trash
    doAddTrash = async e => {
        e.preventDefault();
        const regexNumber = /^\d+$/;
        const regexImage = /([/|.|\w|\s|-])*\.(?:jpg|gif|png)/;
        // check the name validation
        if (!regexNumber.test(this.point.current.value)) {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Gunakan Angka Untuk Poin!'
            })
            return;
        } else if (!regexNumber.test(this.price.current.value)) {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Gunakan Angka Untuk Harga!'
            })
            return;
        } else if (!regexNumber.test(this.category.current.value)) {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Gunakan Angka untuk Kategori!'
            })
            return;
        } else if (!regexImage.test(this.state.photo.name)) {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Gunakan ekstensi .jpg .png atau .gif saja! '
            })
            return;
        }
        const self = this;
        await axios
            .post(this.props.url + `/v1/trash`,
                {
                    trash_category_id: Math.abs(this.category.current.value),
                    trash_name: this.name.current.value,
                    price: Math.abs(this.price.current.value),
                    photo: this.state.urlPhoto,
                    point: Math.abs(this.point.current.value)
                },
                {
                    headers: {
                        Authorization: "Bearer " + String(localStorage.getItem('admin_token'))
                    }
                })
            .then(response => {
                Swal.fire({
                    type: 'success',
                    title: 'Success',
                    text: 'Berhasil Menambahkan Jenis Sampah!'
                })
                this.name.current.value = ''
                this.price.current.value = ''
                this.point.current.value = ''
                this.photo.current.value = ''
                this.setState({ photo: "" })
                this.componentDidMount();
            })
            .catch(error => {
            });
    }

    // function to delete trash from database
    deleteTrash = (e, id) => {
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
            text: "Anda tidak bisa mengembalikan ketika sudah dihapus!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus saja!!',
            cancelButtonText: 'Tidak!',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                let config = {
                    method: "DELETE",
                    url: self.props.url + `/v1/trash/${id}`,
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("admin_token")
                    }
                }
                /* delete with axios */
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

    // Function to pop up image
    openImage = (e, url) => {
        Swal.fire({
            imageUrl: `${url}`,
            imageWidth: '100%',
            width: '80vw'
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
                                <MDBNavLink
                                    className='black-font'
                                    active={this.state.activeItem === "1"}
                                    onClick={this.toggle("1")}
                                    role="tab"
                                >
                                    Tambah Sampah
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink
                                    className='black-font'
                                    active={this.state.activeItem === "2"}
                                    onClick={this.toggle("2")}
                                    role="tab" >
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
                                    <label for="inputPhotoURL">Pilih Foto:</label>
                                    <br />
                                    <progress
                                        value={this.state.progress}
                                        max="100"
                                        style={{ width: "100%" }}
                                    />
                                    <br />
                                    <input
                                        type="file"
                                        onChange={this.handleChangePhoto}
                                    />
                                    <br />
                                    <br />
                                    <button
                                        class="add-button-trash btn btn-lg btn-primary btn-block rounded-pill"
                                        type="submit"
                                        onClick={e => this.doAddTrash(e)}
                                    >
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
                                                            <MDBBtn
                                                                style={{ padding: "4px" }}
                                                                className="button-white  btn btn-lg btn-block rounded-pill"
                                                                onClick={e => this.openImage(e, item.photo)}
                                                            >
                                                                Lihat
                                                            </MDBBtn>
                                                        </td>
                                                        <td valign="bottom"> {item.point}</td>
                                                        <td valign="bottom"> Rp. {item.price}</td>
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
                                                                onClick={e => this.deleteTrash(e, item.id)}
                                                            >
                                                                Delete
                                                            </button>
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

export default connect('url', actions)(Trash);