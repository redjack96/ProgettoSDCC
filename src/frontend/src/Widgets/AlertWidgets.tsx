import Modal from "react-bootstrap/Modal";
import {Button} from "react-bootstrap";
import React from "react";

/*This file define some simple alert modals*/

export function ModalAlert({showAlert, centralPart, setShowAlert}) {
    return (
        <Modal show={showAlert}>
            <Modal.Header closeButton>
                <Modal.Title>Added the following products to list</Modal.Title>
            </Modal.Header>
            <Modal.Body>{centralPart}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => setShowAlert(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export function SimpleModalAlert({showAlert, message, setShowAlert}) {
    return(
        <Modal show={showAlert}>
            <Modal.Header closeButton>
                <Modal.Title>{message}</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button variant="success" onClick={() => setShowAlert(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}