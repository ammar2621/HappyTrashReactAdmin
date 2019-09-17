import React, { Component } from "react";
import {
    MDBBtn,
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
import {
    Redirect,
    Link
} from 'react-router-dom'
import Header from '../../components/Header'
import './Reward.css'
import Swal from 'sweetalert2'
import { storage } from "../../firebase/index";

class Reward extends Component {
    constructor(props) {
        super(props);
        this.name = React.createRef();
        this.stock = React.createRef();
        this.point = React.createRef();
        this.status = React.createRef();
        this.state = {
            activeItem: "1",
            reward: [],
            rewardHistory: [],
            photo: null,
            urlPhoto: "",
            progress: 0,
            statusReward: [],
            names: []
        }
    }

    // function for the tab feature
    toggle = tab => e => {
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
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

    // add the reward (post to API)
    doAddReward = async e => {
        e.preventDefault();
        const regexNumber = /^\d+$/;
        const regexImage = /([/|.|\w|\s|-])*\.(?:jpg|gif|png)/;
        // check the form validation
        if (!regexNumber.test(this.point.current.value)) {
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
                text: 'Gunakan Angka untuk Kategori!'
            })
            return;
        } else if (!regexImage.test(this.state.urlPhoto)) {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Pilih file image terlebih dahulu!'
            })
            return;
        }
        const self = this;
        await axios
            .post(this.props.url + `/v1/rewards`,
                {
                    point_to_claim: Number(this.point.current.value),
                    name: this.name.current.value,
                    stock: Number(this.stock.current.value),
                    photo: this.state.urlPhoto,
                    status: Number(this.status.current.value)
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
                this.stock.current.value = ''
                this.point.current.value = ''
                self.componentDidMount();
            })
            .catch(error => {
            });
    }

    // Function to pop up image
    openImage = (e, url) => {
        Swal.fire({
            imageUrl: `${url}`,
            imageWidth: '100%',
            width: '80vw'
        })
    }

    // Function to pop up user information
    openUserInformation = async (e, id) => {
        const self = this;
        // to get the all trashes 
        await axios
            .get(this.props.url + `/v1/users/admin/${id}`,
                {
                    headers: {
                        Authorization: "Bearer " + String(localStorage.getItem('admin_token'))
                    }
                })
            .then(async response => {
                Swal.fire({
                    html: `<p>Nama: ${response.data.name} <br> No HP: ${response.data.mobile_number} </p>`
                })
            })
            .catch(error => {
            });
    }

    // function to filter the active/non-active rewards
    statusFilter = async e => {
        e.preventDefault();
        const self = this;
        if (e.target.value == '0') {
            // to get the non-active trashes 
            await axios
                .get(this.props.url + `/v1/rewards`,
                    {
                        headers: {
                            Authorization: "Bearer " + String(localStorage.getItem('admin_token'))
                        }
                    })
                .then(async response => {
                    await this.setState({ reward: [], statusReward: [] })
                    await response.data.map((item, index) => {
                        if (item.status === false) {
                            const joined = this.state.reward.concat(item);
                            this.setState({ reward: joined })
                        }
                    })
                    await this.state.reward.map((item, index) => {
                        if (item.status === false) {
                            const joined = this.state.statusReward.concat('Tidak Aktif');
                            this.setState({ statusReward: joined })
                        } else if (item.status === true) {
                            const joined = this.state.statusReward.concat('Aktif');
                            this.setState({ statusReward: joined })
                        }
                    })
                })
                .catch(error => {
                });
        } else if (e.target.value == '1') {
            // to get the active trashes 
            await axios
                .get(this.props.url + `/v1/rewards`,
                    {
                        headers: {
                            Authorization: "Bearer " + String(localStorage.getItem('admin_token'))
                        }
                    })
                .then(async response => {
                    await this.setState({ reward: [], statusReward: [] })
                    await response.data.map((item, index) => {
                        if (item.status === true) {
                            const joined = this.state.reward.concat(item);
                            this.setState({ reward: joined })
                        }
                    })
                    await this.state.reward.map((item, index) => {
                        if (item.status === false) {
                            const joined = this.state.statusReward.concat('Tidak Aktif');
                            this.setState({ statusReward: joined })
                        } else if (item.status === true) {
                            const joined = this.state.statusReward.concat('Aktif');
                            this.setState({ statusReward: joined })
                        }
                    })
                })
                .catch(error => {
                });
        } else if (e.target.value == '2') {
            // to get the all trashes 
            self.setState({ reward: [], statusReward: [] })
            self.componentDidMount();
        }
    }

    // function operate after renderred, to get the list of trashes and category of trashes
    componentDidMount = async () => {
        const self = this;
        // to get the all trashes 
        await axios
            .get(this.props.url + `/v1/rewards`,
                {
                    headers: {
                        Authorization: "Bearer " + String(localStorage.getItem('admin_token'))
                    }
                })
            .then(async response => {
                await this.setState({ reward: response.data })
                await response.data.map((item, index) => {
                    if (item.status === false) {
                        const joined = this.state.statusReward.concat('Tidak Aktif');
                        this.setState({ statusReward: joined })
                    } else if (item.status === true) {
                        const joined = this.state.statusReward.concat('Aktif');
                        this.setState({ statusReward: joined })
                    }
                })
            })
            .catch(error => {
            });
        // to get all categories
        await axios
            .get(this.props.url + '/v1/reward_history',
                {
                    headers: {
                        Authorization: "Bearer " + String(localStorage.getItem('admin_token'))
                    }
                })
            .then(response => {
                const reversedHistory = response.data.sort().reverse().slice(0, 50)
                this.setState({ rewardHistory: reversedHistory })
            })
            .catch(error => {
            });
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
                                    <select
                                        ref={this.status}
                                        class="form-control"
                                        id="status pembayaran"
                                    >
                                        <option value='1'> Aktif</option>
                                        <option value='0'> Non-Aktif</option>
                                    </select>
                                    <br />
                                    <label for="inputPhotoURL">Unggah Foto:</label>
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
                                    <button id="addbuttonreward" class="btn btn-lg btn-primary btn-block rounded-pill" type="submit" onClick={e => this.doAddReward(e)}>
                                        Tambah
                                    </button> <br />

                                </form>
                            </MDBTabPane>
                            <MDBTabPane tabId="2" role="tabpanel">
                                <br />
                                <p style={{ fontWeight: '700', display: 'inline-block' }} > Status Hadiah: &nbsp;</p>
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
                                                <th scope="col">ID</th>
                                                <th scope="col">Nama</th>
                                                <th scope="col">Poin</th>
                                                <th scope="col">Stok</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Foto</th>
                                                <th scope="col">Ubah</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.reward.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td> {item.id} </td>
                                                        <td> {item.name}</td>
                                                        <td> {item.point_to_claim}</td>
                                                        <td> {item.stock} Pcs</td>
                                                        <td> {this.state.statusReward[index]}</td>
                                                        <td>
                                                            <MDBBtn style={{ padding: "4px" }}
                                                                className="button-white  btn btn-lg btn-block rounded-pill"
                                                                onClick={e => this.openImage(e, item.photo)}
                                                            >
                                                                Lihat
                                                            </MDBBtn>
                                                        </td>
                                                        <td>
                                                            <Link
                                                                to={"/reward/edit/" + item.id}>
                                                                <button
                                                                    className="button-green btn btn-lg btn-primary btn-block rounded-pill"
                                                                    type="submit"
                                                                    style={{ padding: "4px" }}
                                                                    valign="center"
                                                                >
                                                                    Edit
                                                                </button>
                                                            </Link>
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
                                                <th scope="col">ID Hadiah</th>
                                                <th scope="col">Penerima</th>
                                                <th scope="col">Hadiah</th>
                                                <th scope="col">Waktu</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.rewardHistory.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td> {item.reward_id}</td>
                                                        <td>
                                                            <MDBBtn
                                                                style={{ padding: "4px", textTransform: 'capitalize' }}
                                                                className="button-white btn btn-lg rounded-pill"
                                                                onClick={e => this.openUserInformation(e, item.user_id)}
                                                            >
                                                                Lihat Penerima
                                                            </MDBBtn> </td>
                                                        <td> {item.reward_name}</td>
                                                        <td> {item.created_at.slice(0, 26)}</td>
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

export default connect('url', actions)(Reward);
