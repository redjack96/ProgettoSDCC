import React, {useState} from "react";
import {Alert, Button, Col, Container, Row} from "react-bootstrap";
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
import {ResponsiveContainer} from "recharts";
import {API_GATEWAY_ADDRESS} from "./Home";

export function Notifications() {
    const [notifications, setNotifications] = useState({
        notification: []
    });
    const [loading, setLoading] = React.useState(false)
    const [voidMessage, setVoidMessage] = React.useState("Nothing to notify.");

    // called on page load, loads the entire list from shopping_list microservice
    React.useEffect(() => {
        if (!loading) {
            console.log("reloading list from server");
            setLoading(true);
            fetch(API_GATEWAY_ADDRESS + '/getNotifications')
                .then(r => {
                    let x = r.json();
                    console.log(x);
                    return x;
                })
                .then(itemsOrError => {
                    try {
                        setNotifications(itemsOrError)
                        setVoidMessage("Nothing to notify.")
                    } catch {
                        console.log("Error: shopping_list service is down")
                        setNotifications({
                            notification: []
                        })
                        setVoidMessage(itemsOrError.msg)
                    }
                })
                .catch(e => console.log("Errore: " + e))
            console.log(notifications);
        }
    }, [notifications]);

    return(
        <React.Fragment>
                {notifications.notification.length === 0 && (
                    <p className="text-center">{voidMessage}</p>
                )}
                {notifications.notification.length != 0 && (
                    <React.Fragment>
                        <Alert key='warning1' variant='warning'>
                            {notifications.notification[0]}
                        </Alert>
                        <Alert key='warning2' variant='warning'>
                            <Col>
                                {notifications.notification[1]}
                                <Button className="ml-3" variant="outline-warning">Warning</Button>{' '}
                            </Col>
                        </Alert>
                    </React.Fragment>
                )}
        </React.Fragment>
    )
}