import {Alert, Button, Col, Container, Form} from "react-bootstrap";
import React from "react";
import {API_GATEWAY_ADDRESS, Item, ProductType, Timestamp, Unit} from "../Services/Home";
import Modal from "react-bootstrap/Modal";
import {ModalAlert, SimpleModalAlert} from "./AlertWidgets";

export function AlertExpired({notification, onDismiss}) {
    let [show, setShow] = React.useState(true);
    const closeFn = () => {
        onDismiss(notification);
        setShow(false);
    }
    if (show) {
        return (
            <Alert key='warning1' variant='warning' onClose={() => closeFn()} dismissible>
                {notification}
            </Alert>
        );
    }
    return null;
}

function AddMissingIngredientToListButton({setVoidMessage, setAvailable, finishedProducts, closeFn}) {
    const addToList = () => {
        console.log("Adding to list these products");
        let defaultQuantity = 1;
        let defaultType = ProductType.Other;
        let defaultUnit = Unit.Packet;
        let expiration = Timestamp.today();
        console.log(expiration);
        for (let i = 0; i < finishedProducts.length; i++) {
            let itemName = finishedProducts[i];
            // when clicking on a submit button, the default behaviour is submitting a form. With this method we prevent this.
            // when this function is called, we submit a new item, so we setSubmitting to true
            let request = API_GATEWAY_ADDRESS + '/addProduct/' + itemName.trim() + '/' + defaultQuantity + '/' + Unit.toString(defaultUnit) + '/' + ProductType.toString(defaultType) + '/' + expiration;
            console.log(request);
            fetch(request, {method: 'POST'})
                .then(r => {
                    setAvailable(true);
                    return r.json()
                })
                .then(opOrError => {
                    if (opOrError.msg.includes("Error")) {
                        // service down
                        setAvailable(false);
                        setVoidMessage(opOrError.msg);
                        console.log("Error: shopping list service unavailable.");
                        return
                    }
                })
                .catch(() => console.log("Added product to list"));
        }
        closeFn();
    }

    return (
        <Container>
            <Button className="ml-3" variant="outline-warning" onClick={addToList}>Add to List</Button>
        </Container>

    );
}

export function AlertFinished({notification, onDismiss}) {
    let [show, setShow] = React.useState(true);
    let [voidMessage, setVoidMessage] = React.useState("");
    let [serviceAvailable, setServiceAvailable] = React.useState(true);
    let [showAlert, setShowAlert] = React.useState(false);
    const closeFn = () => {
        onDismiss(notification);
        setShow(false);
    }
    // "You run out of the following products: Branzino, Melanzane, Farina. Do you want to add them to the shopping list?"
    let lastPart: string = notification.substring("You run out of the following products: ".length, notification.length);
    let centralPart: string = lastPart.split(".")[0]; // Branzino, Melanzane, Farina
    let products: string[] = centralPart.split(", ");
    console.log("products", products);

    const showModal = () => {
        if (serviceAvailable) {
            return <ModalAlert showAlert={showAlert} setShowAlert={setShowAlert} centralPart={centralPart}/>
        } else if (!serviceAvailable) {
            return <SimpleModalAlert showAlert={showAlert} setShowAlert={setShowAlert} message={voidMessage}/>
        }
    }

    if (show) {
        return (
            <Alert variant='warning' key='warning2' onClose={() => closeFn()} dismissible>
                <Col>
                    {notification}
                    <AddMissingIngredientToListButton setVoidMessage={setVoidMessage} setAvailable={setServiceAvailable}
                                                      finishedProducts={products} closeFn={() => {
                        setShow(false);
                        setShowAlert(true);
                    }}/>
                </Col>
                {serviceAvailable && (
                    <ModalAlert showAlert={showAlert} setShowAlert={setShowAlert} centralPart={centralPart}/>
                )}
                {!serviceAvailable && (
                    <SimpleModalAlert showAlert={showAlert} setShowAlert={setShowAlert} message={voidMessage}/>
                )}
            </Alert>
        );
    }
    return (showModal());
}