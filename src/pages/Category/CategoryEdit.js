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
import './Category.css'

class CategoryEdit extends Component {

    constructor(props) {
        super(props);
        this.name = React.createRef();
    }

    editCategory = (e, id) => {
        e.preventDefault();
        const self = this;
        let config = {
            method: "PUT",
            url: self.props.url + "/v1/trash_category/" + id,
            data: {
                category_name: self.name.current.value
            },
            headers: {
                Authorization: "Bearer " + localStorage.getItem("admin_token")
            }
        }
        axios(config).then(function (response) {
            self.props.history.push('/category')
        }).catch(function (error) {
        })
    }

    componentDidMount() {
        const self = this;
        let config = {
            method: "GET",
            url: self.props.url + "/v1/trash_category",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("admin_token")
            }
        }

        axios(config).then(function (response) {
            const categoryThisPage = response.data.filter(category => {
                return category.id == self.props.match.params.category_id
            })
            self.name.current.value = categoryThisPage[0].category_name
        }).catch(function (error) {

        })
    }


    render() {
        if (localStorage.getItem('admin_logged_in') == 'true') {
            return (
                <div style={{ height: "100vh" }}>
                    <Header />
                    <MDBContainer>
                        <br />
                        <h2>Edit Kategori</h2>
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
                            <button class="btn button-green btn-lg btn-primary btn-block rounded-pill" type="submit" style={{ padding: "6px" }}
                                onClick={e => this.editCategory(e, this.props.match.params.category_id)}>
                                Edit
                  </button>

                        </form>
                    </MDBContainer>
                </div >
            );
        } else {
            return <Redirect to="/login" />
        }
    }
}
export default connect("url", actions)(CategoryEdit);