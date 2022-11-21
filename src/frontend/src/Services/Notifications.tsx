import React, {useState} from "react";
import {Alert, Button, Col, Container, Row} from "react-bootstrap";
import {API_GATEWAY_ADDRESS} from "./Home";
import {AlertExpired, AlertFinished} from "../Widgets/NotificationWidgets";

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
                        setVoidMessage("Nothing to notify.")
                    } catch {
                        console.log("Error: Notifications service is down")
                        setNotifications({
                            notification: []
                        })
                        setVoidMessage(itemsOrError.msg)
                    }
                    return itemsOrError;
                })
                .then(value => {
                    console.log("value", value);
                    try {
                        if (value.notification.length > 0) {
                            setViewedNotifications(value);
                        }
                        setVoidMessage("Nothing to notify.")
                    } catch {
                        console.log("Error: Notifications service is down")
                        setViewedNotifications({
                            notification: []
                        })
                        setVoidMessage(value.msg)
                    }
                })
                .catch(e => console.log("Errore: " + e))
            console.log(notifications);
        }
    }, [notifications, viewedNotifications, loading]);

    const onDismiss = notification => {
        let index = viewedNotifications.notification.indexOf(notification);
        console.log(index);
        viewedNotifications.notification.splice(index, 1);
        console.log("before set", viewedNotifications);
        setViewedNotifications(viewedNotifications);
        console.log("after set", viewedNotifications);
    }

    return (
        <React.Fragment>
            {viewedNotifications.notification.length === 0 && (
                <p className="text-center">{voidMessage}</p>
            )}
            {viewedNotifications.notification.length == 1 && (
                <React.Fragment>
                    {viewedNotifications.notification[0].startsWith("The following") && (
                        <AlertExpired notification={viewedNotifications.notification[0]} onDismiss={() => onDismiss(viewedNotifications.notification[0])}/>
                    )}
                    {viewedNotifications.notification[0].startsWith("You run out") && (
                        <AlertFinished notification={viewedNotifications.notification[0]}
                                       onDismiss={() => onDismiss(viewedNotifications.notification[0])}/>
                    )}
                </React.Fragment>
            )}

            {viewedNotifications.notification.length == 2 && (
                <React.Fragment>
                    {viewedNotifications.notification[0].startsWith("The following") && (
                        <AlertExpired notification={viewedNotifications.notification[0]} onDismiss={() => onDismiss(viewedNotifications.notification[0])}/>
                    )}
                    {viewedNotifications.notification[0].startsWith("You run out") && (
                        <AlertFinished notification={viewedNotifications.notification[0]}
                                       onDismiss={() => onDismiss(viewedNotifications.notification[0])}/>
                    )}
                    {viewedNotifications.notification[1].startsWith("The following") && (
                        <AlertExpired notification={viewedNotifications.notification[1]} onDismiss={() => onDismiss(viewedNotifications.notification[1])}/>
                    )}
                    {viewedNotifications.notification[1].startsWith("You run out") && (
                        <AlertFinished notification={viewedNotifications.notification[1]}
                                       onDismiss={() => onDismiss(viewedNotifications.notification[1])}/>
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    )
}