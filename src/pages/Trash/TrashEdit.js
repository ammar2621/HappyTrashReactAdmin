import React, { Component } from "react";
import { MDBContainer } from "mdbreact";
import axios from "axios";
import { connect } from "unistore/react";
import { actions } from "../../store";
import { Redirect } from 'react-router-dom'
import Header from '../../components/Header'
import Swal from 'sweetalert2'
import './Trash.css'
import { storage } from "../../firebase/index";

class TrashEdit extends Component {
    constructor(props) {
        super(props);
        this.name = React.createRef();
        this.price = React.createRef();
        this.point = React.createRef();
        this.category = React.createRef();
        this.state = {
            category: [],
            trash: [],
            urlPhoto: '',
            progress: 0
        }
    }

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
                photo: self.state.urlPhoto
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
                self.state.urlPhoto = self.state.trash[0].photo
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
                            <label for="inputStock" >
                                Kategori:
                            </label>
                            <select
                                ref={this.category}
                                class="form-control"
                                id="status pembayaran"
                            >
                                {this.state.category.map((item, index) => {
                                    return (
                                        <option
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
                                min="0"
                                step="100"
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
                                min="1"
                                ref={this.point}
                            />
                            <br />
                            <label for="inputurlPhoto">
                                Upload Foto (Pilih File Jika Foto Ingin Diubah):
                                    </label>
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