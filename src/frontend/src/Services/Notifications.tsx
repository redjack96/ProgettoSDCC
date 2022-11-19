import React, {useState} from "react";
import {Alert, Button, Col, Container, Row} from "react-bootstrap";
import {API_GATEWAY_ADDRESS} from "./Home";

export function Notifications() {
    const [notifications, setNotifications] = useState({
        notification: []
    });
    const [viewedNotifications, setViewedNotifications] = useState({
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
                        if (notifications.notification.length > 0) {
                            setViewedNotifications(itemsOrError);
                        }
                        setVoidMessage("Nothing to notify.")
                    } catch {
                        console.log("Error: Notifications service is down")
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
                {viewedNotifications.notification.length === 0 && (
                    <p className="text-center">{voidMessage}</p>
                )}
                {viewedNotifications.notification.length == 1 && (
                    <React.Fragment>
                        {viewedNotifications.notification[0].startsWith("The following") && (
                            <Alert key='warning1' variant='warning'>
                                {viewedNotifications.notification[0]}
                            </Alert>
                        )}
                        {viewedNotifications.notification[0].startsWith("You run out") && (
                            <Alert key='warning2' variant='warning'>
                                <Col>
                                    {viewedNotifications.notification[0]}
                                    <Button className="ml-3" variant="outline-warning">Warning</Button>{' '}
                                </Col>
                            </Alert>
                        )}
                    </React.Fragment>
                )}

            {viewedNotifications.notification.length == 2 && (
                <React.Fragment>
                    {viewedNotifications.notification[0].startsWith("The following") && (
                        <Alert key='warning1' variant='warning'>
                            {viewedNotifications.notification[0]}
                        </Alert>
                    )}
                    {viewedNotifications.notification[0].startsWith("You run out") && (
                        <Alert key='warning2' variant='warning'>
                            <Col>
                                {viewedNotifications.notification[0]}
                                <Button className="ml-3" variant="outline-warning">Warning</Button>{' '}
                            </Col>
                        </Alert>
                    )}
                    {viewedNotifications.notification[1].startsWith("The following") && (
                        <Alert key='warning1' variant='warning'>
                            {viewedNotifications.notification[1]}
                        </Alert>
                    )}
                    {viewedNotifications.notification[1].startsWith("You run out") && (
                        <Alert key='warning2' variant='warning'>
                            <Col>
                                {viewedNotifications.notification[1]}
                                <Button className="ml-3" variant="outline-warning">Warning</Button>{' '}
                            </Col>
                        </Alert>
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    )
}