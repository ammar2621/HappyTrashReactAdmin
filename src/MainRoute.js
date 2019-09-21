import React from 'react';
import {
    Route,
    Switch,
    BrowserRouter as Router
} from 'react-router-dom';
import Home from './pages/Home/Home'
import LogIn from './pages/LogIn/LogIn'
import Trash from './pages/Trash/Trash'
import TrashEdit from './pages/Trash/TrashEdit'
import Category from './pages/Category/Category'
import CategoryEdit from './pages/Category/CategoryEdit'
import Reward from './pages/Reward/Reward'
import RewardEdit from './pages/Reward/RewardEdit'
import OrderPage from './pages/Order/OrderPage'
import OrderAddDetails from './pages/Order/OrderAddDetails'
import OrderDetailsCheckout from './pages/Order/OrderDetailsCheckout'
import OrderInvoice from './pages/Order/OrderInvoice';
import NotFound from './pages/NotFound/NotFound';

class MainRoute extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/login' component={LogIn} />
                    <Route exact path='/' component={Home} />
                    <Route exact path='/trash' component={Trash} />
                    <Route exact path='/trash/edit/:trash_id' component={TrashEdit} />
                    <Route exact path='/category' component={Category} />
                    <Route exact path='/category/edit/:category_id' component={CategoryEdit} />
                    <Route exact path='/reward' component={Reward} />
                    <Route exact path='/reward/edit/:reward_id' component={RewardEdit} />
                    <Route exact path='/order' component={OrderPage} />
                    <Route exact path='/order/create/:order_id' component={OrderAddDetails} />
                    <Route exact path='/order/checkout/:order_id' component={OrderDetailsCheckout} />
                    <Route exact path='/order/invoice/:order_id' component={OrderInvoice} />
                    <Route component={NotFound} />
                </Switch>
            </Router>
        );
    }
}

export default MainRoute;
