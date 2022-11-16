// this is called by the route /addPantryPage by ...
import {useLocation, useNavigate} from "react-router-dom";
import React from "react";
import {Button, Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import {PantryItem} from "../../Services/Storage";
import Navbar from "../Utils/Navbar";
import {PageHeader} from "../Utils/PageHeader";
import {API_GATEWAY_ADDRESS, ProductType, Timestamp, Unit} from "../../Services/Home";
import {MDBCard, MDBCardBody} from "mdb-react-ui-kit";


export function AddPantryPage() {
    const {state} = useLocation();
    console.log("items: ", state.items)
    const onAddItem = React.useCallback(
        (newItem: PantryItem) => {
            state.items.products.pushEntry(newItem)
        },
        [state.items],
    );
    return (
        <Container>
            <Navbar/>
            <PageHeader pageName="Add a product in Pantry"/>
            <MDBCard className="form">
                <MDBCardBody>
                    <AddPantryForm onAdd={onAddItem}/>
                </MDBCardBody>
            </MDBCard>
        </Container>
    );
}

function AddPantryForm({onAdd}) {
    const [itemName, setItemName] = React.useState('');
    const [quantity, setQuantity] = React.useState(1);
    const [type, setType] = React.useState(ProductType.Other);
    const [unit, setUnit] = React.useState(Unit.Packet);
    const [expiration, setExpiration] = React.useState('9999-12-31'); // FIXME: forse qua ci vuole un numero, non una stringa.
    // this state is the status of this component. If it is submitting, the item is being added. If not it is already added.
    const [submitting, setSubmitting] = React.useState(false);

    // this is used to return to home when clicking update button
    const navigate = useNavigate();
    const toStorage = () => {
        console.log("called submitAdded item");
        // when clicking on a submit button, the default behaviour is submitting a form. With this method we prevent this.
        // when this function is called, we submit a new item, so we setSubmitting to true
        setSubmitting(true);
        let request = API_GATEWAY_ADDRESS + '/addProductToStorage'+'/' + itemName.trim() + '/' + quantity + '/' + Unit.toString(unit) + '/' + ProductType.toString(type) + '/' + expiration;
        console.log(request);
        fetch(request, {method: 'POST'})
            .then(r => r.json)
            .then(() => {
                setSubmitting(false);
                onAdd(new PantryItem(itemName, quantity, type, unit, new Timestamp(new Date().getTime(), 0),
                    1, 1, 1, new Timestamp(new Date().getTime(), 0)));
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
            </Row>
            <Container>
                <Row className="mb-3">
                    <Button
                        type="submit"
                        variant="success"
                        disabled={!itemName.trim().length}
                        className={submitting ? 'disabled' : ''}
                    >
                        Add
                    </Button>
                </Row>
            </Container>
        </InputGroup>
    </Form>);
}