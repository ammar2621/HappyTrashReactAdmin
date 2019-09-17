import React from "react";
import ReactDOM from "react-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "./index.css";
import MainRoute from "./MainRoute";
import { Provider } from "unistore/react";
import { store } from "./store";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<Provider store={store}>
    <MainRoute />
</Provider>, document.getElementById('root'));

serviceWorker.register();