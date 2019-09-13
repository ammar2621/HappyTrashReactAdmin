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
import Category from './pages/Category/Category'
import CategoryEdit from './pages/Category/CategoryEdit'
import Reward from './pages/Reward/Reward'
import RewardEdit from './pages/Reward/RewardEdit'
import Order from './pages/Order/Order'
import OrderEdit from './pages/Order/Order'

class MainRoute extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/login" component={LogIn} />
                    <Route exact path="/" component={Home} />
                    <Route exact path="/trash" component={Trash} />
                    <Route exact path="/trash/edit/:trash_id" component={TrashEdit} />
                    <Route exact path="/category" component={Category} />
                    <Route exact path="/category/edit/:category_id" component={CategoryEdit} />
                    <Route exact path="/reward" component={Reward} />
                    <Route exact path="/reward/edit/:reward_id" component={RewardEdit} />
                    <Route exact path="/order" component={Order} />
                    <Route exact path="/order/edit:order_id" component={OrderEdit} />
                </Switch>
            </Router>
        );
    }
}

export default MainRoute;
