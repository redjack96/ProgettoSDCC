// this is called by the route /updatePantryPage by ...
import {useLocation, useNavigate} from "react-router-dom";
import React from "react";
import {Button, Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import Navbar from "../Utils/Navbar";
import {PageHeader} from "../Utils/PageHeader";
import {API_GATEWAY_ADDRESS, ProductType, Timestamp, Unit} from "../../Services/Home";
import {MDBCard, MDBCardBody} from "mdb-react-ui-kit";

export function UpdatePantryPage() {
    const {state} = useLocation();
    const productName = state.item.product_name;
    console.log(productName);
    return (
        <Container>
            <Navbar/>
            <PageHeader pageName="Update product in pantry"/>
            <MDBCard className="form">
                <MDBCardBody>
                    <UpdatePantryForm item={state.item}/>
                </MDBCardBody>
            </MDBCard>
        </Container>
    );
}



// here we destructure the props to get the single value from the field of the interface
function UpdatePantryForm({item}) {
    const defaultExpiration = new Timestamp(item.expiration.seconds, 0).getOrderedDateString();
    const [itemName, setItemName] = React.useState(item.item_name);
    const [submitting, setSubmitting] = React.useState(true);
    const [type, setType] = React.useState(item.type);
    const [unit, setUnit] = React.useState(item.unit);
    const [quantity, setQuantity] = React.useState(item.quantity);
    // here we cannot use directly item.expiration.getOrderedDateString(), because Javascript doesn't know it is an object, so it doesn't even know the existence of the method!
    const [expiration, setExpiration] = React.useState(defaultExpiration);
    const [lastUsed, setLastUsed] = React.useState(item.lastUsed);
    const [useNumber, setUseNumber] = React.useState(item.useNumber);
    const [totalUseNumber, setTotalUseNumber] = React.useState(item.totalUseNumber);
    const [timesBought, setTimesBought] = React.useState(item.timesBought);
    const [buyDate, setBuyDate] = React.useState(item.buyDate);

    // this is used to return to home when clicking update button
    const navigate = useNavigate();
    const toStorage = () => {
        console.log("called submitUpdated item");
        // when clicking on a submit button, the default behaviour is submitting a form. With this method we prevent this.
        // when this function is called, we submit a new item, so we setSubmitting to true
        setSubmitting(true);
        // TODO: convertire timestamp in stringa yyyy-mm-dd
        let request = API_GATEWAY_ADDRESS + '/updateProductInStorage' + '/' + itemName.trim() + '/' + quantity +
            '/' + Unit.toString(unit) + '/' + ProductType.toString(type) + '/' + expiration + '/' + lastUsed + '/'
            + useNumber + '/' + totalUseNumber + '/' + timesBought + '/' + buyDate;
        console.log(request);
        fetch(request, {method: 'POST'})
            .then(r => r.json)
            .then(() => {
                setSubmitting(false);
                // we update the state of "itemName" to an empty string, to clean the text field.
                setItemName('');
            })
        navigate('/productStoragePage');
    }

    return (<Form onSubmit={() => toStorage()}>
        <InputGroup className="mb-3">
            {/*This is needed to write the name of the product*/}
            <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridName">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                        value={itemName}
                        onChange={e => setItemName(e.target.value)}
                        type="text"
                        placeholder="New Item"
                        aria-describedby="basic-addon1"
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group as={Col} controlId="formExpirationDate">
                    <Form.Label>Expiration Date</Form.Label>
                    <Form.Control
                        value={expiration}
                        onChange={e => {
                            console.log(e.target.value);
                            return setExpiration(e.target.value);
                        }}
                        type="date"
                    />
                </Form.Group>
                <Form.Group as={Col} controlId="formBuyDate">
                    <Form.Label>Buy Date</Form.Label>
                    <Form.Control
                        value={lastUsed}
                        onChange={e => {
                            return setBuyDate(e.target.value);
                        }}
                        type="date"
                    />
                </Form.Group>
                <Form.Group as={Col} controlId="formLastUsed">
                    <Form.Label>Last Used</Form.Label>
                    <Form.Control
                        value={lastUsed}
                        onChange={e => {
                            return setLastUsed(e.target.value);
                        }}
                        type="date"
                    />
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="formQuantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                        value={quantity.valueOf()}
                        onChange={e => setQuantity(parseInt(e.target.value))}
                        type="number"
                        placeholder="0"
                        aria-describedby="basic-addon1"
                    />
                </Form.Group>
                <Form.Group as={Col} controlId="formSelectUnit">
                    <Form.Label>Unit</Form.Label>
                    <Form.Control as="select" onChange={e => setUnit(Unit.parse(e.target.value))} defaultValue={Unit.toString(unit)}>
                        <option>Select unit...</option>
                        <option>Bottle</option>
                        <option>Packet</option>
                        <option>Kg</option>
                        <option>Grams</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group as={Col} controlId="formSelectType">
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
                </Form.Group>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formUseNumber">
                        <Form.Label>Uses</Form.Label>
                        <Form.Control
                            value={useNumber}
                            onChange={event => setUseNumber(event.target.value)}
                            type="number"
                            placeholder="0"
                            aria-describedby="basic-addon1"
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formTotalUseNumber">
                        <Form.Label>Total Uses</Form.Label>
                        <Form.Control
                            value={totalUseNumber}
                            onChange={event => setTotalUseNumber(event.target.value)}
                            type="number"
                            placeholder="0"
                            aria-describedby="basic-addon1"
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formTimesBought">
                        <Form.Label>Times Bought</Form.Label>
                        <Form.Control
                            value={timesBought}
                            onChange={event => setTimesBought(event.target.value)}
                            type="number"
                            placeholder="0"
                            aria-describedby="basic-addon1"
                        />
                    </Form.Group>
                </Row>
            </Row>
            <Container>
                <Row className="mb-3">
                    <Button
                        type="submit"
                        variant="success"
                        disabled={!itemName.trim().length}
                        className={submitting ? 'disabled' : ''}
                    >
                        Update
                    </Button>
                </Row>
            </Container>
        </InputGroup>
    </Form>);
}