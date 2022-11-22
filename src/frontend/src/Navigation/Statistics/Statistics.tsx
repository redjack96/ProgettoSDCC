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
import {Notifications} from "../../Services/Notifications";

/**
 * This component renders the dashboard for notifications, consumptions and summary microservices
 */
export function Statistics() {
    return(
        <Container>
            <Navbar/>
            <PageHeader pageName="Statistics"/>
            <Row className="mb-3">
                <Col mb={2}>
                    <MDBCard className="form">
                        <MDBCardBody>
                            <Col className="border-right">
                                <h2>Notifications</h2>
                                <Notifications />
                            </Col>
                        </MDBCardBody>
                    </MDBCard>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <MDBCard className="form">
                        <MDBCardBody className="pb-5">
                            <Col>
                                <h2>Summary</h2>
                                <Summary />
                            </Col>
                        </MDBCardBody>
                    </MDBCard>
                </Col>
                <Col sm={5}>
                    <MDBCard className="form">
                        <MDBCardBody>
                            <Col>
                                <h2>Consumption</h2>
                                <Consumptions/>
                            </Col>
                        </MDBCardBody>
                    </MDBCard>
                </Col>
            </Row>
        </Container>
    )
}