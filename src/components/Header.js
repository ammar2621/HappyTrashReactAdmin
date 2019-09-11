import React, { Component } from "react";
import {
    MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBFormInline,
    MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBContainer
} from "mdbreact";
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'

class Header extends Component {


    doLogOut = async e => {
        e.preventDefault();
        localStorage.setItem('admin_logged_in', '')
        localStorage.setItem('user_token', '')
        window.location.reload()
        alert('Anda Berhasil Log Out!')
    }

    render() {
        return (
            <Router>
                <MDBNavbar className="ml" color="indigo" dark expand="md" id="navbar">
                    <MDBContainer fluid>
                        <MDBNavbarBrand>
                            <strong className="white-text"></strong>
                        </MDBNavbarBrand>
                        <MDBNavbarToggler onClick={this.toggleCollapse} />
                        <MDBCollapse id="navbarCollapse3" navbar>
                            <MDBNavbarNav right>
                                <MDBNavItem active>
                                    <MDBNavLink >Home</MDBNavLink>
                                </MDBNavItem>
                                <MDBNavItem>
                                    <MDBNavLink onClick={this.doLogOut}>Logout</MDBNavLink>
                                </MDBNavItem>
                            </MDBNavbarNav>

                        </MDBCollapse>
                    </MDBContainer>
                </MDBNavbar>
            </Router>
        );
    }
}

export default Header;