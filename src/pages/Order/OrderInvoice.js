import React, { Component } from "react";
import {
    MDBBtn,
    MDBContainer
} from "mdbreact";
import axios from "axios";
import { connect } from "unistore/react";
import { actions } from "../../store/store";
import {
    Redirect,
    Link
} from 'react-router-dom'
import Header from '../../components/Header'
import './Order.css'
import Swal from 'sweetalert2'

class OrderInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order_invoice: [{ User: { name: null }, Order: { adress: null }, Details: [] }],
            lat: "",
            lng: "",
            adress: "",
            additialNotes: ""
        }
    }

    // function to pop up user address
    openGoogleMap = (e) => {
        Swal.fire({
            html: `<iframe 
                width="300" height="450" frameborder="0" style="border:0;" allowfullscreen=""
                scrolling="no" marginheight="0" marginwidth="0" 
                src="https://maps.google.com/maps?q=${this.state.lat},${this.state.lng}&hl=es;z=17&amp;output=embed"
                >
                </iframe>`
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
            .then(async function (response) {
                let order_id = parseInt(self.props.match.params.order_id)
                let order = response.data.filter(function (obj) {
                    return obj.Order.id === order_id
                })
                self.setState({ order_invoice: order })
            })
            .catch(function (error) {
                console.log(error)
            })
        const jsonAdress = JSON.parse(this.state.order_invoice[0].Order.adress)
        const lat = jsonAdress["lat"]
        const lng = jsonAdress["lng"]
        const adress = jsonAdress["adress"]
        const additialNotes = jsonAdress["additialNotes"]
        this.setState({ lat, lng, adress, additialNotes })

    }

    render() {
        if (localStorage.getItem('admin_logged_in') == 'true') {
            return (
                <div style={{ height: "100vh" }}>
                    <Header />
                    <MDBContainer id="bodyreward">
                        <br />
                        <h2 style={{ textAlign: 'center' }}>Invoice</h2>
                        <div className="table-responsive">
                            <table class="table ">
                                <thead className="thead-green">
                                    <tr>
                                        <th colSpan="4" scope="col"><h4 className="bold-text">Informasi Klien</h4></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="bold-text">
                                            Nama:
                                        </td>
                                        <td >
                                            {this.state.order_invoice[0].User.name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bold-text">Waktu Penjemputan</td>
                                        <td>{String(this.state.order_invoice[0].Order.time).slice(0, 26)}</td>
                                    </tr>
                                    <tr>
                                        <td className="bold-text">Alamat</td>
                                        <td>{this.state.adress}</td>
                                    </tr>
                                    <tr>
                                        <td className="bold-text">Catatan</td>
                                        <td>{this.state.additialNotes}</td>
                                    </tr>
                                    <tr>
                                        <td className="bold-text">Foto</td>
                                        <td>
                                            <MDBBtn style={{ padding: "4px" }}
                                                className="button-white  btn btn-lg btn-block rounded-pill"
                                                onClick={e => this.openImage(e, this.state.order_invoice[0].Order.photo)}>
                                                Lihat
                                            </MDBBtn>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bold-text">Google Map</td>
                                        <td>
                                            <MDBBtn style={{ padding: "4px" }}
                                                className="button-white  btn btn-lg btn-block rounded-pill"
                                                onClick={e => this.openGoogleMap(e)}>
                                                Lihat
                                            </MDBBtn>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="table-responsive">
                            <table class="table ">
                                <thead className="thead-green">
                                    <tr>
                                        <th colSpan="4" scope="col"><h4 className="bold-text">Informasi Sampah</h4></th>
                                    </tr>
                                    <tr className='thead-white'>
                                        <th scope="col" className="bold-text">Jenis</th>
                                        <th scope="col" className="bold-text">Berat (kg)</th>
                                        <th scope="col" className="bold-text">Harga</th>
                                        <th scope="col" className="bold-text">Point</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.order_invoice[0].Details.map((elm, key) => {
                                        return (
                                            <tr>
                                                <td valign="bottom">{elm.trash_detail.trash_name}</td>
                                                <td valign="bottom">{elm.qty} kg</td>
                                                <td valign="bottom">Rp. {elm.total_price}</td>
                                                <td valign="bottom">{elm.point}</td>
                                            </tr>
                                        )
                                    })}
                                    <tr>
                                        <th colSpan="1" className="text-right">Total:</th>
                                        <td>{this.state.order_invoice[0].Order.total_qty} kg</td>
                                        <td>Rp. {this.state.order_invoice[0].Order.total_price}</td>
                                        <td>{this.state.order_invoice[0].Order.total_point}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <Link to="/order">
                            <button class="btn btn-lg button-green btn-block rounded-pill" type="submit">
                                OK
                            </button>
                        </Link>
                        <br />
                        <br />
                    </MDBContainer>
                </div >
            );
        } else {
            return <Redirect to="/login" />
        }
    }
}
export default connect("url", actions)(OrderInvoice);