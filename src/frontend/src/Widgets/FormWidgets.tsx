import {Button, Col, Form} from "react-bootstrap";
import React from "react";
import {ProductType, Unit} from "../Services/Home";
import {polarToCartesian} from "recharts/types/util/PolarUtils";


export function NameInput({itemName, setItemName, isUpdate}){
    return (
        <Form.Group as={Col} controlId="formGridName">
            <Form.Label>Name</Form.Label>
            {isUpdate === true && (
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
                disabled >
                </Form.Control>
            )}
            {isUpdate == false && (
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
            )}
        </Form.Group>
    );
}

export function UnitSelect({unit, setUnit, isUpdate}){
    return (<Form.Group as={Col} controlId="formSelectUnit">
        <Form.Label>Unit</Form.Label>
        {isUpdate === true && (
            <Form.Control as="select" onChange={e => setUnit(Unit.parse(e.target.value))} defaultValue={Unit.toString(unit)}
                          disabled >
                <option>Select unit...</option>
                <option>Bottle</option>
                <option>Packet</option>
                <option>Kg</option>
                <option>Grams</option>
            </Form.Control>
        )}
        {isUpdate == false && (
            <Form.Control as="select" onChange={e => setUnit(Unit.parse(e.target.value))} defaultValue={Unit.toString(unit)}>
                <option>Select unit...</option>
                <option>Bottle</option>
                <option>Packet</option>
                <option>Kg</option>
                <option>Grams</option>
            </Form.Control>
        )}
    </Form.Group>);
}

export function ProductTypeSelect({type, setType, isUpdate}){
    return (<Form.Group as={Col} controlId="formSelectType">
        <Form.Label>Type</Form.Label>
        {/*Il value è della select*/}
        {isUpdate === true && (
            <Form.Control as="select" onChange={e => setType(ProductType.parse(e.target.value))} defaultValue={ProductType.toString(type)}
            disabled >
                <option>Select product type...</option>
                <option>Vegetable</option>
                <option>Fruit</option>
                <option>Meat</option>
                <option>Drink</option>
                <option>Fish</option>
                <option>Other</option>
            </Form.Control>
        )}
        {isUpdate === false && (
            <Form.Control as="select" onChange={e => setType(ProductType.parse(e.target.value))} defaultValue={ProductType.toString(type)}>
                <option>Select product type...</option>
                <option>Vegetable</option>
                <option>Fruit</option>
                <option>Meat</option>
                <option>Drink</option>
                <option>Fish</option>
                <option>Other</option>
            </Form.Control>
        )}
    </Form.Group>);
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

export function UseNumberInput({useNumber, setUseNumber}) {
    return(
        <Form.Group as={Col} controlId="formUseNumber">
            <Form.Label>Uses</Form.Label>
            <Form.Control
                value={useNumber}
                onChange={event => {
                    let inputUseNumber = parseInt(event.target.value);
                    setUseNumber(inputUseNumber < 0 ? 0 : inputUseNumber);
                }}
                type="number"
                placeholder="0"
                aria-describedby="basic-addon1"
            />
        </Form.Group>
    );
}

export function TotalUseNumberInput({totalUseNumber, setTotalUseNumber}) {
    return(
        <Form.Group as={Col} controlId="formTotalUseNumber">
            <Form.Label>Total Uses</Form.Label>
            <Form.Control
                value={totalUseNumber}
                onChange={event => {
                    let inputTotalUseNumber = parseInt(event.target.value);
                    setTotalUseNumber(inputTotalUseNumber < 0 ? 0 : inputTotalUseNumber);
                }}
                type="number"
                placeholder="0"
                aria-describedby="basic-addon1"
            />
        </Form.Group>
    )
}

export function TimesBoughtInput({timesBought, setTimesBought}) {
    return(
        <Form.Group as={Col} controlId="formTimesBought">
            <Form.Label>Times Bought</Form.Label>
            <Form.Control
                value={timesBought}
                onChange={event => {
                    let inputTimesBought = parseInt(event.target.value);
                    setTimesBought(inputTimesBought < 0 ? 0 : inputTimesBought);
                }}
                type="number"
                placeholder="0"
                aria-describedby="basic-addon1"
            />
        </Form.Group>
    );
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
