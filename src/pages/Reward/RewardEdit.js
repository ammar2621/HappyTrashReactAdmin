import React, { Component } from "react";
import {
    MDBContainer
} from "mdbreact";
import axios from "axios";
import { connect } from "unistore/react";
import { actions } from "../../store";
import { Redirect, Link } from 'react-router-dom'
import Header from '../../components/Header'
import Swal from 'sweetalert2'
import { storage } from "../../firebase/index";

class RewardEdit extends Component {
    constructor(props) {
        super(props);
        this.name = React.createRef();
        this.image = React.createRef();
        this.stock = React.createRef();
        this.point = React.createRef();
        this.status = React.createRef();
        this.state = {
            reward: [],
            progress: 0,
            photo: '',
            urlPhoto: ''
        }
    }

    // funtion to store photo uploaded by user
    handleChangePhoto = e => {
        e.preventDefault();
        const regexImage = /([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/;
        if (!regexImage.test(e.target.files[0].name)) {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Gunakan ekstensi .jpg .png atau .gif saja! '
            })
            return false;
        } else if (e.target.files[0]) {
            if (e.target.files[0].size < 5000000) {
                this.setState({ photo: e.target.files[0] })
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
                    text: 'Maksimal file 5MB!'
                })
            }
        }
    };

    // edit trash to database 
    doEditReward = e => {
        e.preventDefault();
        const regexName = /^[^\s]+(\s+[^\s]+)*$/;
        const regexNumber = /^\d+$/;
        // check the form validation
        if (!regexName.test(this.name.current.value) | this.name.current.value === "") {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Nama tidak boleh spasi/kosong!!'
            })
            return false;
        } else if (!regexNumber.test(this.point.current.value)) {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Gunakan Angka Untuk Poin!'
            })
            return;
        } else if (!regexNumber.test(this.stock.current.value)) {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Gunakan Angka untuk Stok!'
            })
            return;
        }
        const self = this;
        let config = {
            method: "PUT",
            url: self.props.url + "/v1/rewards/" + self.props.match.params.reward_id,
            data: {
                point_to_claim: Number(this.point.current.value),
                name: this.name.current.value,
                stock: Number(this.stock.current.value),
                photo: this.state.urlPhoto,
                status: Number(this.status.current.value)
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
            self.props.history.push('/reward')
        }).catch(function (error) {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Gagal!'
            })
        })
    }


    // function operate after renderred, to get the list of rewardes and category of rewardes
    componentDidMount = async () => {
        const self = this;
        // to get the all rewardes 
        await axios
            .get(`${this.props.url}/v1/rewards`,
                {
                    headers: {
                        Authorization: "Bearer " + String(localStorage.getItem('admin_token'))
                    }
                })
            .then(response => {
                const rewardThisPage = response.data.filter((item, index) => {
                    if (item.id == this.props.match.params.reward_id) {
                        return item
                    }
                })
                self.setState({ reward: rewardThisPage })
                self.name.current.value = self.state.reward[0].name
                self.stock.current.value = self.state.reward[0].stock
                self.status.current.value = String(Number(self.state.reward[0].status))
                self.point.current.value = self.state.reward[0].point_to_claim
                self.state.urlPhoto = self.state.reward[0].photo
            })
            .catch(error => {
            });
    }

    render() {
        if (localStorage.getItem('admin_logged_in') == 'true') {
            return (
                <div style={{ height: "100vh" }}>
                    <Header />
                    <MDBContainer id="bodyreward">
                        <br />
                        <h2 id="titlerewardedit">Edit Hadiah</h2>
                        <form class="form-signin">
                            <label for="inputName" >
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
                            <label for="inputPoint  " >
                                Poin:
                                    </label>
                            <input
                                type="number"
                                id="inputPoint  "
                                class="form-control"
                                placeholder="Nilai Poin"
                                min="1"
                                ref={this.point}
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
                                min="0"
                                ref={this.stock}
                            />
                            <br />
                            <label for="inputStock">
                                Status:
                                    </label>
                            <select ref={this.status} class="form-control" >
                                <option value='1'> Aktif</option>
                                <option value='0'> Non-Aktif</option>
                            </select>
                            <br />
                            <label for="inputPhoto" >
                                Upload Foto (Pilih Foto Jika Ingin Diganti):
                            </label>
                            <br />
                            <progress
                                value={this.state.progress}
                                max="100"
                                style={{ width: "100%" }}
                            />
                            <br />
                            <input type="file" onChange={this.handleChangePhoto} />
                            <br />
                            <br />
                            <button
                                id="addbuttonreward"
                                class="btn btn-lg btn-primary btn-block rounded-pill"
                                type="submit"
                                onClick={e => this.doEditReward(e)}
                            >
                                Edit
                            </button>
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
export default connect('url', actions)(RewardEdit);