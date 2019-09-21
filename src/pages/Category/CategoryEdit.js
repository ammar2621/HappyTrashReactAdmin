import React, { Component } from "react";
import { MDBContainer } from "mdbreact";
import axios from "axios";
import { connect } from "unistore/react";
import { actions } from "../../store";
import { Redirect } from 'react-router-dom'
import Header from '../../components/Header'
import './Category.css'
import Swal from 'sweetalert2'

class CategoryEdit extends Component {
    constructor(props) {
        super(props);
        this.name = React.createRef();
        this.status = React.createRef();
    }

    // to edit/put the new category name
    editCategory = (e, id) => {
        e.preventDefault();
        const regex = /^[^\s]+(\s+[^\s]+)*$/;
        if (!regex.test(this.name.current.value) | this.name.current.value === "") {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Jangan spasi/kosong!!'
            })
            return false;
        }
        const self = this;
        let config = {
            method: "PUT",
            url: self.props.url + "/v1/trash_category/" + id,
            data: {
                category_name: self.name.current.value,
                status: !!Number(self.status.current.value)
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

    // function that works after the dom renderred
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
            self.status.current.value = String(Number(categoryThisPage[0].status))
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
                            <label for="inputStatus">
                                Status:
                                    </label>
                            <select ref={this.status} class="form-control" >
                                <option value='1'> Aktif</option>
                                <option value='0'> Non-Aktif</option>
                            </select>
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