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
import './Order.css'
import Swal from 'sweetalert2'

class OrderPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: "1",
            modalUser: false,
            modalAddress: false,
            modalPhoto: false,
            allOrder: [],
            waitingOrder: [],
            confirmedOrder: [],
            notFoundWaiting: "",
            notFoundConfirmed: "",
            notFoundOrder: "",
            statusOrder: []
        }
    }

    // Function to pop up image
    openImage = (e, url) => {
        Swal.fire({
            imageUrl: `${url}`,
            imageWidth: '100%',
            width: '80vw'
        })
    }

    // function to filter the order status
    statusFilter = async e => {
        e.preventDefault();
        const self = this;
        if (e.target.value == '0') {
            // to get all orders
            self.setState({ allOrder: [], statusOrder: [] })
            self.componentDidMount();
        } else if (e.target.value == '1') {
            // to get the done order 
            await axios
                .get(this.props.url + `/v1/orders`,
                    {
                        headers: {
                            Authorization: "Bearer " + String(localStorage.getItem('admin_token'))
                        }
                    })
                .then(async response => {
                    await this.setState({ allOrder: [], statusOrder: [] })
                    await response.data.map((item, index) => {
                        if (item.Order.status === 'done') {
                            const joined = this.state.allOrder.concat(item);
                            this.setState({ allOrder: joined })
                        }
                    })
                    await this.state.allOrder.map((item, index) => {
                        if (item.Order.status === 'done') {
                            const joined = this.state.statusOrder.concat('Selesai');
                            this.setState({ statusOrder: joined })
                        }
                    })
                    if (this.state.allOrder.length === 0) {
                        this.setState({ notFoundOrder: "---Tabel Kosong---" })
                    } else {
                        this.setState({ notFoundOrder: "" })
                    }
                })
                .catch(error => {
                });
        } else if (e.target.value == '2') {
            // to get the rejected order 
            await axios
                .get(this.props.url + `/v1/orders`,
                    {
                        headers: {
                            Authorization: "Bearer " + String(localStorage.getItem('admin_token'))
                        }
                    })
                .then(async response => {
                    await this.setState({ allOrder: [], statusOrder: [] })
                    await response.data.map((item, index) => {
                        if (item.Order.status === 'rejected') {
                            const joined = this.state.allOrder.concat(item);
                            this.setState({ allOrder: joined })
                        }
                    })
                    await this.state.allOrder.map((item, index) => {
                        if (item.Order.status === 'rejected') {
                            const joined = this.state.statusOrder.concat('Ditolak');
                            this.setState({ statusOrder: joined })
                        }
                    })
                    if (this.state.allOrder.length === 0) {
                        this.setState({ notFoundOrder: "---Tabel Kosong---" })
                    } else {
                        this.setState({ notFoundOrder: "" })
                    }
                })
                .catch(error => {
                });
        } else if (e.target.value == '3') {
            // to get the cancelled order
            await axios
                .get(this.props.url + `/v1/orders`,
                    {
                        headers: {
                            Authorization: "Bearer " + String(localStorage.getItem('admin_token'))
                        }
                    })
                .then(async response => {
                    await this.setState({ allOrder: [], statusOrder: [] })
                    await response.data.map((item, index) => {
                        if (item.Order.status === 'cancelled') {
                            const joined = this.state.allOrder.concat(item);
                            this.setState({ allOrder: joined })
                        }
                    })
                    await this.state.allOrder.map((item, index) => {
                        if (item.Order.status === 'cancelled') {
                            const joined = this.state.statusOrder.concat('Dibatalkan');
                            this.setState({ statusOrder: joined })
                        }
                    })
                    if (this.state.allOrder.length === 0) {
                        this.setState({ notFoundOrder: "---Tabel Kosong---" })
                    } else {
                        this.setState({ notFoundOrder: "" })
                    }
                })
                .catch(error => {
                });
        } else if (e.target.value == '4') {
            // to get the waiting orders
            await axios
                .get(this.props.url + `/v1/orders`,
                    {
                        headers: {
                            Authorization: "Bearer " + String(localStorage.getItem('admin_token'))
                        }
                    })
                .then(async response => {
                    await this.setState({ allOrder: [], statusOrder: [] })
                    await response.data.map((item, index) => {
                        if (item.Order.status === 'waiting') {
                            const joined = this.state.allOrder.concat(item);
                            this.setState({ allOrder: joined })
                        }
                    })
                    await this.state.allOrder.map((item, index) => {
                        if (item.Order.status === 'waiting') {
                            const joined = this.state.statusOrder.concat('Menunggu');
                            this.setState({ statusOrder: joined })
                        }
                    })
                    if (this.state.allOrder.length === 0) {
                        this.setState({ notFoundOrder: "---Tabel Kosong---" })
                    } else {
                        this.setState({ notFoundOrder: "" })
                    }
                })
                .catch(error => {
                });
        }
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

    // making the tab enabled
    toggle = tab => e => {
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
        }
    };

    // function to open user information
    openUser = (e, contact) => {
        Swal.fire(
            'Kontak : ' + contact
        )
    }

    // function to pop up user address
    openAddress = (e, address) => {
        Swal.fire({
            html: `<p>Map sedang dalam proses pembuatan ${address} </p>`
        })
    }

    // function to make order status become confirmed
    confirmOrder = (e, id) => {
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
            text: "",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, konfirmasi saja!!',
            cancelButtonText: 'Tidak!',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                let config = {
                    method: "PUT",
                    url: self.props.url + "/v1/orders/" + id,
                    data: {
                        "status": "confirmed"
                    },
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("admin_token")
                    }
                }
                axios(config)
                    .then(function (response) {
                        self.componentDidMount();
                    })
                    .catch(function (error) {
                    })
                self.componentDidMount();
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

    // function to reject order
    rejectOrder = (e, id) => {
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
            text: "Anda tidak bisa mengembalikan ketika sudah dicancel",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, cancel saja!!',
            cancelButtonText: 'Tidak!',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                let config = {
                    method: "PUT",
                    url: self.props.url + "/v1/orders/" + id,
                    data: {
                        "status": "rejected"
                    },
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("admin_token")
                    }
                }
                axios(config)
                    .then(function (response) {
                        self.componentDidMount();
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

    // function that happens after renderred
    componentDidMount = async () => {
        const self = this;
        let config = {
            method: "GET",
            url: self.props.url + "/v1/orders",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("admin_token")
            }
        }
        await axios(config)
            .then(function (response) {
                console.log(response.data)
                let waitingOrder = response.data.filter(function (order) {
                    return order.Order.status == 'waiting'
                })
                let confirmedOrder = response.data.filter(function (order) {
                    return order.Order.status == 'confirmed'
                })
                self.setState({ allOrder: response.data })
                self.setState({ confirmedOrder })
                self.setState({ waitingOrder })
                response.data.map((item, index) => {
                    if (item.Order.status === 'cancelled') {
                        const joined = self.state.statusOrder.concat('Dibatalkan');
                        self.setState({ statusOrder: joined })
                    } else if (item.Order.status === 'waiting') {
                        const joined = self.state.statusOrder.concat('Menunggu');
                        self.setState({ statusOrder: joined })
                    } else if (item.Order.status === 'done') {
                        const joined = self.state.statusOrder.concat('Selesai');
                        self.setState({ statusOrder: joined })
                    } else if (item.Order.status === 'rejected') {
                        const joined = self.state.statusOrder.concat('Ditolak');
                        self.setState({ statusOrder: joined })
                    }
                })
            }).catch(function (error) {
            })
        if (this.state.waitingOrder.length === 0) {
            this.setState({
                notFoundWaiting: '---Tabel Kosong---'
            })
        } else {
            this.setState({
                notFoundWaiting: ""
            })
        }
        if (this.state.confirmedOrder.length === 0) {
            this.setState({
                notFoundConfirmed: '---Tabel Kosong---'
            })
        } else {
            this.setState({
                notFoundConfirmed: ""
            })
        }
        if (this.state.allOrder.length === 0) {
            this.setState({
                notFoundOrder: '---Tabel Kosong---'
            })
        } else {
            this.setState({
                notFoundOrder: ""
            })
        }
    }

    render() {
        if (localStorage.getItem('admin_logged_in') == 'true') {
            return (
                <div style={{ height: "100vh" }}>
                    <Header />
                    <MDBContainer id="bodyreward" style={{ height: "100vh" }}>
                        <br />
                        <h2 id="titlereward">Pengaturan Order</h2>
                        <MDBNav className="nav-tabs ">
                            <MDBNavItem>
                                <MDBNavLink className="tab-reward" active={this.state.activeItem === "1"} onClick={this.toggle("1")} role="tab" >
                                    Order Masuk
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink className="tab-reward" active={this.state.activeItem === "2"} onClick={this.toggle("2")} role="tab" >
                                    Order Terkonfirmasi
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink className="tab-reward" active={this.state.activeItem === "3"} onClick={this.toggle("3")} role="tab" >
                                    Riwayat Order
                                </MDBNavLink>
                            </MDBNavItem>
                        </MDBNav>
                        <MDBTabContent activeItem={this.state.activeItem} >
                            <MDBTabPane tabId="1" role="tabpanel">
                                <div className="table-responsive">
                                    <table class="table table-hover ">
                                        <thead>
                                            <tr>
                                                <th scope="col">Terima</th>
                                                <th scope="col">Tolak</th>
                                                <th scope="col">Penjemputan</th>
                                                <th scope="col">Nama</th>
                                                <th scope="col">Alamat</th>
                                                <th scope="col">Foto</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.waitingOrder.map((elm, key) => {
                                                    return (
                                                        <tr>
                                                            <td valign="bottom"> <button className="btn btn-lg button-green btn-success btn-block rounded-pill" type="submit" style={{ padding: "4px" }} valign="center" onClick={e => this.confirmOrder(e, elm.Order.id)} >
                                                                Terima
                                                        </button>
                                                            </td>
                                                            <td valign="bottom">
                                                                <button className="btn btn-lg btn-danger btn-block rounded-pill" type="submit" style={{ padding: "4px" }} onClick={e => this.rejectOrder(e, elm.Order.id)}>
                                                                    Tolak
                                                                </button>
                                                            </td>
                                                            <td valign="bottom"> {elm.Order.time.slice(0, 26)}</td>
                                                            <td valign="bottom">
                                                                <a onClick={e => this.openUser(e, elm.User.mobile_number)}>
                                                                    {elm.User.name}
                                                                </a>
                                                            </td>
                                                            <td valign="bottom">
                                                                <MDBBtn style={{ padding: "4px" }}
                                                                    className="button-white  btn btn-lg btn-block rounded-pill"
                                                                    onClick={e => this.openAddress(e, elm.Order.adress)}
                                                                >
                                                                    Lihat
                                                            </MDBBtn>
                                                            </td>
                                                            <td valign="bottom">
                                                                <MDBBtn style={{ padding: "4px" }}
                                                                    className="button-white  btn btn-lg btn-block rounded-pill"
                                                                    onClick={e => this.openImage(e, elm.Order.photo)}
                                                                >
                                                                    Lihat
                                                            </MDBBtn>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    <p
                                        className="text-center"
                                        style={{ fontSize: '20px' }}
                                    >
                                        {this.state.notFoundWaiting}
                                    </p>
                                </div>
                            </MDBTabPane>
                            <MDBTabPane tabId="2" role="tabpanel">
                                <div className="table-responsive">
                                    <table class="table table-hover ">
                                        <thead>
                                            <tr>
                                                <th scope="col">Isi Detail</th>
                                                <th scope="col">Batal</th>
                                                <th scope="col">Waktu Penjemputan</th>
                                                <th scope="col">Nama</th>
                                                <th scope="col">Alamat</th>
                                                <th scope="col">Foto</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.confirmedOrder.map((elm, key) => {
                                                    return (
                                                        <tr>
                                                            <td valign="bottom">
                                                                <Link to={"/order/create/" + elm.Order.id}>
                                                                    <button className="btn btn-lg btn-success btn-block rounded-pill" type="submit" style={{ padding: "4px" }} valign="center" >
                                                                        ISI
                                                                    </button>
                                                                </Link>
                                                            </td>
                                                            <td valign="bottom">
                                                                <button
                                                                    className="btn btn-lg btn-danger btn-block rounded-pill"
                                                                    type="submit" style={{ padding: "4px" }}
                                                                    onClick={e => this.rejectOrder(e, elm.Order.id)}>
                                                                    Batal
                                                                </button>
                                                            </td>
                                                            <td valign="bottom"> {elm.Order.time.slice(0, 26)}</td>
                                                            <td valign="bottom">
                                                                <a onClick={e => this.openUser(e, elm.User.mobile_number)}>
                                                                    {elm.User.name}
                                                                </a>
                                                            </td>
                                                            <td valign="bottom">
                                                                <MDBBtn style={{ padding: "4px" }}
                                                                    className="button-white  btn btn-lg btn-block rounded-pill"
                                                                    onClick={e => this.openAddress(e, elm.Order.adress)}
                                                                >
                                                                    Lihat
                                                            </MDBBtn>
                                                            </td>
                                                            <td valign="bottom">
                                                                <MDBBtn style={{ padding: "4px" }}
                                                                    className="button-white  btn btn-lg btn-block rounded-pill"
                                                                    onClick={e => this.openImage(e, elm.Order.photo)}
                                                                >
                                                                    Lihat
                                                            </MDBBtn>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    <p
                                        className="text-center"
                                        style={{ fontSize: '20px' }}
                                    >
                                        {this.state.notFoundConfirmed}
                                    </p>
                                </div>
                            </MDBTabPane>
                            <MDBTabPane tabId="3" role="tabpanel">
                                <br />
                                <p style={{ fontWeight: '700', display: 'inline-block' }} > Status Order: &nbsp;</p>
                                <select
                                    style={{ maxWidth: '120px', display: 'inline-block', fontWeight: '700' }}
                                    className="form-control"
                                    onChange={e => this.statusFilter(e)}
                                >
                                    <option value='0'> Semua</option>
                                    <option value='1'> Selesai</option>
                                    <option value='2'> Ditolak</option>
                                    <option value='3'> Dibatalkan</option>
                                    <option value='4'> Menunggu</option>
                                </select>
                                <div className="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col">No</th>
                                                <th scope="col">Nama</th>
                                                <th scope="col">Waktu Penjemputan</th>
                                                <th scope="col">Waktu Dibuat</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Alamat</th>
                                                <th scope="col">Foto</th>
                                                <th scope="col">Lihat Detail</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.allOrder.map((elm, key) => {
                                                    return (
                                                        <tr>
                                                            <td>{key + 1}</td>
                                                            <td valign="bottom">
                                                                <a onClick={e => this.openUser(e, elm.User.mobile_number)}>
                                                                    {elm.User.name}
                                                                </a>
                                                            </td>
                                                            <td valign="bottom"> {elm.Order.time.slice(0, 26)}</td>
                                                            <td valign="bottom"> {elm.Order.created_at.slice(0, 26)}</td>
                                                            <td valign="bottom"> {this.state.statusOrder[key]}</td>
                                                            <td valign="bottom">
                                                                <MDBBtn style={{ padding: "4px" }}
                                                                    className="button-white  btn btn-lg btn-block rounded-pill"
                                                                    onClick={e => this.openAddress(e, elm.Order.adress)}
                                                                >
                                                                    Lihat
                                                                </MDBBtn>
                                                            </td>
                                                            <td valign="bottom">
                                                                <MDBBtn style={{ padding: "4px" }}
                                                                    className="button-white  btn btn-lg btn-block rounded-pill"
                                                                    onClick={e => this.openImage(e, elm.Order.photo)}
                                                                >
                                                                    Lihat
                                                                </MDBBtn>
                                                            </td>
                                                            <td valign="bottom"> <Link to={"/order/invoice/" + elm.Order.id}> <button className="btn button-green btn-lg btn-primary btn-block rounded-pill" type="submit" style={{ padding: "4px" }} valign="center" >
                                                                Lihat Detail
                                                        </button></Link>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    <p
                                        className="text-center"
                                        style={{ fontSize: '20px' }}
                                    >
                                        {this.state.notFoundOrder}
                                    </p>
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
export default connect("url", actions)(OrderPage);