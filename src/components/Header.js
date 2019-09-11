import React, { Component } from "react";
import {
    MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBFormInline,
    MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBContainer
} from "mdbreact";
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'

class Header extends Component {
    state = {
        isOpen: false
    };

    toggleCollapse = () => {
        this.setState({ isOpen: !this.state.isOpen });
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
                        <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                            <MDBNavbarNav right>
                                <MDBNavItem active>
                                    <MDBNavLink to="#!">Home</MDBNavLink>
                                </MDBNavItem>
                                <MDBNavItem>
                                    <MDBNavLink to="#!">Logout</MDBNavLink>
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