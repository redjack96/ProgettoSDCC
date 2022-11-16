import React from "react";
import {Container} from "react-bootstrap";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCardImage,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBListGroup,
    MDBListGroupItem,
    MDBRipple,
    MDBRow,
    MDBTooltip,
    MDBTypography,
} from "mdb-react-ui-kit";
import Navbar from "../Navigation/Utils/Navbar";

export function Summary() {
    return(
        <Container>
            <Navbar/>
            <p>Summary</p>
        </Container>
    )
}