import React, { Component } from "react";
import {
    MDBContainer
} from "mdbreact";
import axios from "axios";
import { connect } from "unistore/react";
import { actions } from "../../store";
import { Redirect } from 'react-router-dom'
import Header from '../../components/Header'
import Swal from 'sweetalert2'
import './Trash.css'

class TrashEdit extends Component {
    constructor(props) {
        super(props);
        this.name = React.createRef();
        this.photo = React.createRef();
        this.price = React.createRef();
        this.point = React.createRef();
        this.category = React.createRef();
        this.state = {
            category: [],
            trash: []
        }
    }

    // edit trash to database 
    editTrash = e => {
        e.preventDefault();
        const regex_http = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
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
        } else if (!regex_http.test(this.photo.current.value)) {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Gunakan Format URL yang Benar! (https://blabla.com/contoh.png)'
            })
            return false
        }
        const self = this;
        let config = {
            method: "PUT",
            url: self.props.url + "/v1/trash/" + self.props.match.params.trash_id,
            data: {
                trash_name: self.name.current.value,
                trash_category_id: self.category.current.value,
                price: self.price.current.value,
                point: self.point.current.value,
                photo: self.photo.current.value
            },
            headers: {
                Authorization: "Bearer " + localStorage.getItem("admin_token")
            }
        }
        axios(config).then(function (response) {
            Swal.fire({
                type: 'success',
                title: 'Success',
                text: 'Berhasil Mengganti!'
            })
            self.props.history.push('/trash')
        }).catch(function (error) {
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
                const trashThisPage = response.data.filter((item, index) => {
                    if (item.id == this.props.match.params.trash_id) {
                        return item
                    }
                })
                self.setState({ trash: trashThisPage })
                self.name.current.value = self.state.trash[0].trash_name
                self.category.current.value = self.state.trash[0].trash_category_id
                self.price.current.value = self.state.trash[0].price
                self.point.current.value = self.state.trash[0].point
                self.photo.current.value = self.state.trash[0].photo
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
                        <h2 className="title-of-page">Edit Sampah</h2>
                        <form class="form-signin">
                            <label for="inputName" >
                                Nama:
                                    </label>
                            <input
                                type="text"
                                id="inputName"
                                class="form-control"
                                placeholder="Nama"
                                required='true'
                                ref={this.name}
                            />
                            <br />
                            <label for="inputPhotoURL" >
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
                            <label for="inputStock" >
                                Kategori:
                            </label>
                            <select class="form-control" id="status pembayaran" ref={this.category}>
                                {this.state.category.map((item, index) => {
                                    return (
                                        <option
                                            ref={this.category}
                                            value={item.id}> {item.category_name}</option>
                                    )
                                })}
                            </select>
                            <br />
                            <label for="inputPrice" >
                                Harga:
                                    </label>
                            <input
                                type="number"
                                id="inputPrice"
                                class="form-control"
                                placeholder="Harga"
                                required='required'
                                ref={this.price}
                            />
                            <br />
                            <label for="inputPoint" >
                                Poin:
                                    </label>
                            <input
                                type="Number"
                                id="inputPoint"
                                class="form-control"
                                placeholder="Poin"
                                required='required'
                                ref={this.point}
                            />
                            <br />
                            <label for="inputPhotoURL">
                                Upload Foto (masih dalam pengembangan):
                                    </label>
                            <progress value="30" max="100" style={{ width: "100%" }} /> <br />
                            <input className="" type="file" placeholder="Upload Gambar" /> <br />  <br />
                            <button class="btn btn-lg btn-primary btn-block rounded-pill"
                                type="submit"
                                style={{ padding: "6px" }}
                                onClick={e => this.editTrash(e)}>
                                Edit
                            </button>
                            <br />
                            <br />
                        </form>
                    </MDBContainer>
                </div >
            );
        } else {
            return <Redirect to="/login" />
        }
    }
}
export default connect('url', actions)(TrashEdit);