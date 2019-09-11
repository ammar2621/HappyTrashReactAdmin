import React from "react";
import {
    Route,
    Switch,
    BrowserRouter as Router
} from "react-router-dom";
import { connect } from "unistore/react";
import { actions } from "./store";
import Home from './pages/Home/Home'
import LogIn from './pages/LogIn/LogIn'
import Trash from './pages/Trash/Trash'
import TrashEdit from './pages/Trash/TrashEdit'

class MainRoute extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/login" component={LogIn} />
                    <Route exact path="/" component={Home} />
                    <Route exact path="/trash" component={Trash} />
                    <Route exact path="/trash/edit/:id" component={TrashEdit} />
                </Switch>
            </Router>
        );
    }
}

export default MainRoute;
