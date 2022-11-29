import {Button, Col, Form} from "react-bootstrap";
import React from "react";
import {ProductType, Unit} from "../Services/Home";

/*This file defines in one place the inputs that are used for several forms*/

export function NameInput({itemName, setItemName, isUpdate, isUse}) {
    const setSanitizedString = (str: string) => {
        str = str.replace(/[^A-Za-z ]/g, '');
        let capitalized = capitalizeWords(str);
        setItemName(capitalized)
    }
    return (
        <Form.Group as={Col} controlId="formGridName">
            <Form.Label>Name</Form.Label>
            {isUse === true && (
                <Form.Control
                    value={itemName}
                    onChange={e => setSanitizedString(e.target.value)}
                    type="text"
                    placeholder="Use item"
                    aria-describedby="basic-addon1"
                    disabled={isUpdate}>
                </Form.Control>
            )}
            {isUse === false && (
                <Form.Control
                    value={itemName}
                    onChange={e => setSanitizedString(e.target.value)}
                    type="text"
                    placeholder="New Item"
                    aria-describedby="basic-addon1"
                    disabled={isUpdate}>
                </Form.Control>
            )}
        </Form.Group>
    );
}

export function UnitSelect({unit, setUnit, isUpdate}) {
    return (<Form.Group as={Col} controlId="formSelectUnit">
        <Form.Label>Unit</Form.Label>
        {isUpdate === true && (
            <Form.Select as="select" onChange={e => setUnit(Unit.parse(e.target.value))} defaultValue={Unit.toString(unit)} disabled>
                <option>Select unit...</option>
                <option>Bottle</option>
                <option>Packet</option>
                <option>Kg</option>
                <option>Grams</option>
            </Form.Select>
        )}
        {isUpdate === false && (
            <Form.Select as="select" onChange={e => setUnit(Unit.parse(e.target.value))} defaultValue={Unit.toString(unit)}>
                <option>Select unit...</option>
                <option>Bottle</option>
                <option>Packet</option>
                <option>Kg</option>
                <option>Grams</option>
            </Form.Select>
        )}
    </Form.Group>);
}

export function ProductTypeSelect({type, setType, isUpdate}) {
    return (<Form.Group as={Col} controlId="formSelectType">
        <Form.Label>Type</Form.Label>
        {/*Il value è della select*/}
        {isUpdate === true && (
            <Form.Select onChange={e => setType(ProductType.parse(e.target.value))} defaultValue={ProductType.toString(type)}
                         disabled>
                <option>Select product type...</option>
                <option>Vegetable</option>
                <option>Fruit</option>
                <option>Meat</option>
                <option>Drink</option>
                <option>Fish</option>
                <option>Other</option>
            </Form.Select>
        )}
        {isUpdate === false && (
            <Form.Select onChange={e => setType(ProductType.parse(e.target.value))} defaultValue={ProductType.toString(type)}>
                <option>Select product type...</option>
                <option>Vegetable</option>
                <option>Fruit</option>
                <option>Meat</option>
                <option>Drink</option>
                <option>Fish</option>
                <option>Other</option>
            </Form.Select>
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

export function QuantityInput({quantity, setQuantity}) {
    return (<Form.Group as={Col} controlId="formQuantity">
        <Form.Label>Quantity</Form.Label>
        <Form.Control
            value={Number(quantity).toString()}
            onChange={e => {
                setNumber(e.target.value, setQuantity);
            }}
            type="number"
            aria-describedby="basic-addon1"
        />
    </Form.Group>);
}

export function UseNumberInput({useNumber, setUseNumber}) {
    return (
        <Form.Group as={Col} controlId="formUseNumber">
            <Form.Label>Uses</Form.Label>
            <Form.Control
                value={Number(useNumber).toString()}
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
    return (
        <Form.Group as={Col} controlId="formTotalUseNumber">
            <Form.Label>Total Uses</Form.Label>
            <Form.Control
                value={Number(totalUseNumber).toString()}
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
    return (
        <Form.Group as={Col} controlId="formTimesBought">
            <Form.Label>Times Bought</Form.Label>
            <Form.Control
                value={Number(timesBought).toString()}
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

export function SubmitButton({itemName, submitting, buttonText}) {
    return (<Button
        type="submit"
        variant="success"
        disabled={!itemName.trim().length}
        className={submitting ? 'disabled' : 'enabled'}
    >
        {buttonText}
    </Button>);
}

export function UpdateButton({buttonText}) {
    return (
        <Button
            type="submit"
            variant="success"
        >
            {buttonText}
        </Button>
    );
}

export function BackButton({backFn}) {
    return (
        <Button
            type="button"
            variant="secondary"
            onClick={() => backFn()}
        >
            Cancel
        </Button>
    );
}

function setNumber(n: string, setN: (arg0: number) => void) {
    let inputQuantity = parseInt(n);
    setN(inputQuantity < 0 || isNaN(inputQuantity) ? 0 : inputQuantity);
}

function capitalizeWords(str: string): string {
    let splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}