import React, { Component } from "react";
import {
    MDBBtn,
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBInput
} from "mdbreact";
import axios from "axios";
import { connect } from "unistore/react";
import { actions } from "../../store";
import { Redirect, Link } from 'react-router-dom'
import './LogIn.css'

class LogIn extends Component {
    constructor(props) {
        super(props);
        this.doLogIn = this.doLogIn.bind(this);
        this.email = React.createRef();
        this.password = React.createRef();
    }

    // post action to API to login
    doLogIn = async e => {
        e.preventDefault();
        const self = this;
        await axios
            .post(this.props.url + "/v1/auth", {
                email: this.email.current.value,
                password: this.password.current.value
            })
            .then(response => {
                localStorage.setItem('admin_logged_in', true)
                localStorage.setItem('admin_token', response.data.token)
                this.props.history.push('/')
            })
            .catch(error => {
                alert('Password atau Email Salah!')
            });
    };

    render() {
        return (
            <div style={{ height: "100vh" }} id="login">
                <MDBContainer >
                    <MDBRow center='true' className="justify-content-center">
                        <MDBCol md="6" >
                            <br />
                            <br />
                            <br />
                            <h1 className="text-center">Dasbor Admin</h1>
                            <br />
                            <form>
                                <p className="h4 text-center mb-4">Login</p>
                                <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                                    Email:
                                </label>
                                <input
                                    type="email"
                                    id="defaultFormLoginEmailEx"
                                    className="form-control"
                                    ref={this.email}
                                    required
                                />
                                <br />
                                <label htmlFor="defaultFormLoginPasswordEx" className="grey-text">
                                    Password:
                                </label>
                                <input
                                    type="password"
                                    id="defaultFormLoginPasswordEx"
                                    className="form-control"
                                    ref={this.password}
                                    required
                                />
                                <div className="text-center mt-4">
                                    <MDBBtn className="rounded-pill" style={{ width: "145px", fontWeight: "700" }} onClick={this.doLogIn} id="LoginButton" type="submit">Masuk</MDBBtn>
                                </div>
                            </form>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer >
            </div >
        );
    }
}

export default connect("url", actions)(LogIn);