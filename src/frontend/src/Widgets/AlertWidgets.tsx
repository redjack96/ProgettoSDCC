import Modal from "react-bootstrap/Modal";
import {Button} from "react-bootstrap";
import React from "react";

export function ModalAlert({showAlert, centralPart, setShowAlert}){
    return (<Modal show={showAlert}>
        <Modal.Header closeButton>
            <Modal.Title>Added the following products to list</Modal.Title>
        </Modal.Header>
        <Modal.Body>{centralPart}</Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={() => setShowAlert(false)}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>);
}