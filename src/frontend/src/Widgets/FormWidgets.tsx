import {Button, Col, Form} from "react-bootstrap";
import React from "react";
import {ProductType, Unit} from "../Services/Home";


export function NameInput({itemName, setItemName}){
    return (
        <Form.Group as={Col} controlId="formGridName">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
                value={itemName}
                onChange={e => {
                    let itemNameStr : string = e.target.value;
                    itemNameStr = itemNameStr.replace(/[^A-Za-z]/g, '');
                    let firstChar : string = itemNameStr.charAt(0).toUpperCase();
                    let itemNameStrUppercase : string = firstChar + itemNameStr.substring(1, itemNameStr.length).toLowerCase()
                    setItemName(itemNameStrUppercase.trim())
                }}
                type="text"
                placeholder="New Item"
                aria-describedby="basic-addon1"
            >
            </Form.Control>
        </Form.Group>
    );
}

export function ExpirationInput({expiration, setExpiration}) {
    return (<Form.Group as={Col} controlId="formExpirationDate">
        <Form.Label>Expiration Date</Form.Label>
        <Form.Control
            value={expiration}
            onChange={e => {
                console.log(e.target.value);
                return setExpiration(e.target.value);
            }}
            type="date"
        />
    </Form.Group>);
}

export function QuantityInput({quantity, setQuantity}){
    return (<Form.Group as={Col} controlId="formQuantity">
        <Form.Label>Quantity</Form.Label>
        <Form.Control
            value={quantity.valueOf()}
            onChange={e => {
                let inputQuantity = parseInt(e.target.value);
                setQuantity(inputQuantity < 0 ? 0 : inputQuantity);
            }}
            type="number"
            placeholder="0"
            aria-describedby="basic-addon1"
        />
    </Form.Group>);
}

export function UnitSelect({unit, setUnit}){
    return (<Form.Group as={Col} controlId="formSelectUnit">
        <Form.Label>Unit</Form.Label>
        <Form.Control as="select" onChange={e => setUnit(Unit.parse(e.target.value))} defaultValue={Unit.toString(unit)}>
            <option>Select unit...</option>
            <option>Bottle</option>
            <option>Packet</option>
            <option>Kg</option>
            <option>Grams</option>
        </Form.Control>
    </Form.Group>);
}

export function ProductTypeSelect({type, setType}){
    return (<Form.Group as={Col} controlId="formSelectType">
        <Form.Label>Type</Form.Label>
        {/*Il value è della select*/}
        <Form.Control as="select" onChange={e => setType(ProductType.parse(e.target.value))} defaultValue={ProductType.toString(type)}>
            <option>Select product type...</option>
            <option>Vegetable</option>
            <option>Fruit</option>
            <option>Meat</option>
            <option>Drink</option>
            <option>Fish</option>
            <option>Other</option>
        </Form.Control>
    </Form.Group>);
}

export function SubmitButton({itemName, submitting, buttonText}){
    return (<Button
        type="submit"
        variant="success"
        disabled={!itemName.trim().length}
        className={submitting ? 'disabled' : 'enabled'}
    >
        {buttonText}
    </Button>);
}