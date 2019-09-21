import React from "react";
import { connect } from "unistore/react";
import { actions } from "../../store/store";
import { Link } from "react-router-dom"

class NotFound extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div
                    className="text-center"
                    style={{
                        height: "800px",
                        width: "100%",
                        minHeight: "100vh"
                    }}
                >
                    <div style={{ padding: "200px 0px 0px 0px" }}>
                        <h1
                            className="text-center animated fadeInDown"
                            style={{
                                fontSize: "32px"
                            }}
                        >
                            404
                            <br />
                            Halaman Tidak Ada
                    </h1>
                        <h5
                            className="text-center animated fadeInDown"
                        >
                            Klik <Link to="/">disini</Link> untuk ke beranda
                        </h5>
                    </div>
                    <br />
                    <br />
                </div>
            </div>
        );
    }
}

export default connect(
    "",
    actions
)(NotFound);
