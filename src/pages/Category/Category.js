import React, { Component } from "react";
import {
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
import { Redirect, Link } from 'react-router-dom'
import Header from '../../components/Header'

class Category extends Component {

    constructor(props) {
        super(props);
        this.name = React.createRef();
        this.doSubmit = this.doSubmit.bind(this);
        this.state = {
            activeItem: "1",
            categories: []
        }
    }


    toggle = tab => e => {
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
        }
    };

    doSubmit = e => {

        e.preventDefault();
        const self = this;
        let config = {
            method: "POST",
            url: self.props.url + "/v1/trash_category",
            data: {
                category_name: self.name.current.value
            },
            headers: {
                Authorization: "Bearer " + localStorage.getItem("admin_token")
            }
        };
        axios(config).then(function (response) {
            console.log(response)
        }).catch(function (error) {
            console.log(error)
        })
    }

    componentDidMount = () => {
        const self = this;

        let config = {
            method: "GET",
            url: self.props.url + "/v1/trash_category",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("admin_token")
            }
        }
        axios(config).then(function (response) {
            self.setState({ categories: response.data })

        }).catch(function (error) {
            console.log(error)
        })
    }

    deleteCategory = (e, id) => {
        e.preventDefault();
        const self = this;
        let config = {
            method: "DELETE",
            url: self.props.url + "/v1/trash_category/" + id,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("admin_token")
            }
        }
        axios(config)
            .then(function (response) {
                console.log(response)
                self.componentDidMount()
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    render() {
        if (localStorage.getItem('admin_logged_in') == 'true') {
            return (
                <div style={{ height: "100vh" }}>
                    <Header />
                    <MDBContainer>
                        <br />
                        <h2>Pengaturan Kategori</h2>
                        <MDBNav className="nav-tabs ">
                            <MDBNavItem>
                                <MDBNavLink active={this.state.activeItem === "1"} onClick={this.toggle("1")} role="tab" >
                                    Tambah Kategori
            </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink active={this.state.activeItem === "2"} onClick={this.toggle("2")} role="tab" >
                                    List Kategori
            </MDBNavLink>
                            </MDBNavItem>
                        </MDBNav>
                        <MDBTabContent activeItem={this.state.activeItem} >
                            <MDBTabPane tabId="1" role="tabpanel">
                                <br />
                                <form class="form-signin">
                                    <label for="inputName" class="sr-only">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="inputName"
                                        class="form-control"
                                        placeholder="Nama"
                                        ref={this.name}

                                    />
                                    <br />
                                    <button style={{ padding: "4px" }} class="btn btn-lg btn-primary btn-block rounded-pill" type="submit" onClick={e => this.doSubmit(e)}>
                                        Tambah
                  </button>

                                </form>
                            </MDBTabPane>
                            <MDBTabPane tabId="2" role="tabpanel">
                                <div className="table-responsive">
                                    <table class="table ">
                                        <thead>
                                            <tr>
                                                <th scope="col">ID Kategori</th>
                                                <th scope="col">Nama</th>
                                                <th scope="col">Created At</th>
                                                <th scope="col">Updated At</th>
                                                <th scope="col">Edit</th>
                                                <th scope="col">Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>


                                            {this.state.categories.map((elm, key) => {
                                                return (
                                                    <tr>
                                                        <td valign="bottom"> {elm.id}</td>
                                                        <td valign="bottom"> {elm.category_name}</td>
                                                        <td valign="bottom"> {elm.created_at}</td>
                                                        <td valign="bottom"> {elm.updated_at}</td>
                                                        <td valign="bottom">
                                                            <Link to={"/category/edit/" + elm.id}><button className="btn btn-lg btn-primary btn-block rounded-pill" type="submit" style={{ padding: "4px" }} valign="center"
                                                            >
                                                                Edit
                                                        </button>
                                                            </Link>
                                                        </td>
                                                        <td valign="bottom"> <button className="btn btn-lg btn-danger btn-block rounded-pill" type="submit" style={{ padding: "4px" }}
                                                            onClick={e => this.deleteCategory(e, elm.id)}
                                                        >
                                                            Hapus
                                                </button></td>
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
// export default Category;
export default connect("url", actions)(Category);