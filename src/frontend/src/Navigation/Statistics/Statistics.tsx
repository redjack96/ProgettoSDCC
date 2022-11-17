import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import {
    MDBCard,
    MDBCardBody,
} from "mdb-react-ui-kit";
import Navbar from "../Utils/Navbar";
import {PageHeader} from "../Utils/PageHeader";
import {Summary} from "../../Services/Summary";
import {Consumptions} from "../../Services/Consumptions";

export function Statistics() {
    return(
        <Container>
            <Navbar/>
            <PageHeader pageName="Statistics"/>
            <Row className="mb-3">
                <Col sm={8}>
                    <MDBCard className="form">
                        <MDBCardBody>
                            <Col>
                                <h2>Summary</h2>
                                <Summary />
                            </Col>
                        </MDBCardBody>
                    </MDBCard>
                </Col>
                <Col>
                    <MDBCard className="form">
                        <MDBCardBody>
                            <Col className="border-right">
                                <h2>Notifications</h2>
                            </Col>
                        </MDBCardBody>
                    </MDBCard>
                </Col>
            </Row>
            <Row className="mb-3">
                <MDBCard className="form">
                    <MDBCardBody>
                        <h2>Consumption</h2>
                        <Consumptions/>
                    </MDBCardBody>
                </MDBCard>
            </Row>
        </Container>
    )
}