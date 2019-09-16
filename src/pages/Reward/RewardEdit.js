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

class RewardEdit extends Component {
    constructor(props) {
        super(props);
        this.name = React.createRef();
        this.image = React.createRef();
        this.stock = React.createRef();
        this.point = React.createRef();
        this.status = React.createRef();
        this.state = {
            reward: []
        }
    }

    // edit trash to database 
    doEditReward = e => {
        e.preventDefault();
        const regex_http = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
        const regex_number = /^\d+$/;
        const regex_name = /^[a-zA-Z ]{2,30}$/;;
        // // check the name validation
        // if (!regex_name.test(this.name.current.value)) {
        //     Swal.fire({
        //         type: 'error',
        //         title: 'Oops...',
        //         text: 'Gunakan Huruf Untuk Nama (Minimal 2 Huruf)!'
        //     })
        //     return false
        // } else if (!regex_number.test(this.point.current.value)) {
        //     Swal.fire({
        //         type: 'error',
        //         title: 'Oops...',
        //         text: 'Gunakan Angka Untuk Poin!'
        //     })
        //     return false
        // } else if (!regex_number.test(this.price.current.value)) {
        //     Swal.fire({
        //         type: 'error',
        //         title: 'Oops...',
        //         text: 'Gunakan Angka Untuk Harga!'
        //     })
        //     return false
        // } else if (!regex_number.test(this.category.current.value)) {
        //     Swal.fire({
        //         type: 'error',
        //         title: 'Oops...',
        //         text: 'Gunakan Angka untuk Kategori!'
        //     })
        //     return false
        // } else if (!regex_http.test(this.photo.current.value)) {
        //     Swal.fire({
        //         type: 'error',
        //         title: 'Oops...',
        //         text: 'Gunakan Format URL yang Benar! (https://blabla.com/contoh.png)'
        //     })
        //     return false
        // }
        const self = this;
        let config = {
            method: "PUT",
            url: self.props.url + "/v1/rewards/" + self.props.match.params.reward_id,
            data: {
                point_to_claim: Number(this.point.current.value),
                name: this.name.current.value,
                stock: Number(this.stock.current.value),
                photo: this.image.current.value,
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
                console.log('INI', response.data)
                const rewardThisPage = response.data.filter((item, index) => {
                    if (item.id == this.props.match.params.reward_id) {
                        return item
                    }
                })
                console.log(rewardThisPage)
                self.setState({ reward: rewardThisPage })
                self.name.current.value = self.state.reward[0].name
                self.stock.current.value = self.state.reward[0].stock
                self.status.current.value = String(Number(self.state.reward[0].status))
                self.point.current.value = self.state.reward[0].point_to_claim
                self.image.current.value = self.state.reward[0].photo
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
                            <label for="inputStock" >
                                URL Gambar:
                                    </label>
                            <input
                                type="text"
                                id="inputStock"
                                class="form-control"
                                placeholder="URL Gambar"
                                min="1"
                                ref={this.image}
                            />
                            <br />
                            <label for="inputPhoto" >
                                Upload Foto (masih dalam pengembangan):
                                    </label> <br />
                            <progress value="30" max="100" style={{ width: "100%" }} /> <br />
                            <input className="" type="file" placeholder="Upload Gambar" /> <br />  <br />
                            <button id="addbuttonreward" class="btn btn-lg btn-primary btn-block rounded-pill" type="submit" onClick={e => this.doEditReward(e)}>
                                Edit
                                    </button> <br />

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