import React, { Component } from "react";
import { MDBContainer } from "mdbreact";
import axios from "axios";
import { connect } from "unistore/react";
import { actions } from "../../store";
import { Redirect, Link } from 'react-router-dom'
import Header from '../../components/Header'
import './Order.css'

class OrderDetailsCheckout extends Component {
    constructor(props) {
        super(props);
        this.name = React.createRef();
        this.imageURL = React.createRef();
        this.price = React.createRef();
        this.point = React.createRef();
        this.categoryID = React.createRef();
        this.state = {
            order: { User: { name: null }, Order: null, Details: [] }
        }
    }

    componentDidMount() {
        const self = this;
        let config = {
            method: "GET",
            url: self.props.url + "/v1/orders",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("admin_token")
            }
        }
        axios(config)
            .then(async function (response) {
                console.log(response.data)
                let order = await response.data.filter(function (obj) {
                    return obj.Order.id == self.props.match.params.order_id
                })
                self.setState({ order: order[0] })
                console.log(self.state)
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    render() {
        if (localStorage.getItem('admin_logged_in') == 'true') {
            return (
                <div style={{ height: "100vh" }}>
                    <Header />
                    <MDBContainer id="bodyreward">
                        <br />
                        <h2 id="titlerewardedit">Checkout</h2>
                        <h4>Nama: {this.state.order.User.name}</h4>
                        <div className="table-responsive">
                            <table class="table ">
                                <thead>
                                    <tr>
                                        <th scope="col">Jenis Sampah</th>
                                        <th scope="col">Berat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.order.Details.map((elm, key) => {
                                        return (
                                            <tr>
                                                <td valign="bottom">{elm.trash_detail.trash_name}</td>
                                                <td valign="bottom">{elm.qty}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <Link to={"/order/invoice/" + this.props.match.params.order_id}>
                            <button id="checkout-button-order" class="btn btn-lg btn-primary btn-block rounded-pill" type="submit" >
                                OK
                            </button>
                        </Link>
                        <br />
                    </MDBContainer>
                </div >
            );
        } else {
            return <Redirect to="/login" />
        }
    }
}
export default connect("url", actions)(OrderDetailsCheckout);