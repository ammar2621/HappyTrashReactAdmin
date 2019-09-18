import React, { Component } from "react";
import {
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavItem,
    MDBNavLink,
    MDBNavbarToggler,
    MDBCollapse
} from "mdbreact";
import { Link } from 'react-router-dom'
import Logo from './img/new_white.png'
import { connect } from "unistore/react";
import { actions } from "../store";
import Swal from 'sweetalert2'
import './index.css'

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }
    }

    // to collapse or open the navbar
    toggleCollapse = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    // to log out from account
    doLogOut = async e => {
        localStorage.setItem('admin_logged_in', '')
        localStorage.setItem('admin_token', '')
        Swal.fire({
            type: 'success',
            title: 'Success',
            text: 'Anda Berhasil Logout!'
        })
    }

    render() {
        return (
            <MDBNavbar id="navbar" color="default-color" dark expand="md">
                <MDBNavbarBrand>
                    <Link to="/">
                        <img src={Logo} height='30px' />
                    </Link>
                </MDBNavbarBrand>
                <MDBNavbarToggler onClick={this.toggleCollapse} />
                <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                    <MDBNavbarNav right>
                        <MDBNavItem active>
                            <MDBNavLink to="/" >Home</MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                            <MDBNavLink to='/login' onClick={this.doLogOut}>Logout</MDBNavLink>
                        </MDBNavItem>
                    </MDBNavbarNav>
                </MDBCollapse>
            </MDBNavbar>
        );
    }
}

export default connect(
    "",
    actions
)(Header);