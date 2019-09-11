import React, { Component } from "react";
import { MDBBtn, MDBCol, MDBContainer, MDBRow } from "mdbreact";
import "./index.css";
import logo from "./logo.png";

class App extends Component {
  render() {
    return (
      <MDBContainer>
        <MDBRow center style={{ backgroundColor: "white" }} >
          <MDBCol middle="true" sm="8" className="text-center" >

            <img src={logo} alt="logo" style={{ width: "10rem" }} />
            <p className="mb-2">The application is configured and ready to import our components.</p>


          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default App;
