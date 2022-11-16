import React from 'react'
import {useLocation, useNavigate} from "react-router-dom";
import {Button, Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import {API_GATEWAY_ADDRESS, Item, ProductType, Timestamp, Unit} from "../../Services/Home";
import Navbar from "../Utils/Navbar";
import {PageHeader} from "../Utils/PageHeader";
import {MDBCard, MDBCardBody} from "mdb-react-ui-kit";

// this is called by the route /updateProductPage by the ItemDisplay's Update button
function UpdateProductPage() {
    const location = useLocation();
    const productName = location.state.item.product_name;
    return (
        <Container>
            <Navbar />
            <PageHeader pageName="Update product in list"/>
            <MDBCard className="form">
                <MDBCardBody>
                    <UpdateForm item={location.state.item}/>
                </MDBCardBody>
            </MDBCard>
        </Container>
    );
}

// this is used to get help from the IDE in UpdateForm component
interface UpdateFormProps {
    item: Item
}

// here we destructure the props to get the single value from the field of the interface
function UpdateForm({item}: UpdateFormProps) {
    const defaultExpiration = new Timestamp(item.expiration.seconds, 0).getOrderedDateString();
    const [itemName, setItemName] = React.useState(item.product_name);
    const [submitting, setSubmitting] = React.useState(true);
    const [type, setType] = React.useState(item.type);
    const [unit, setUnit] = React.useState(item.unit);
    const [quantity, setQuantity] = React.useState(item.quantity);
    // here we cannot use directly item.expiration.getOrderedDateString(), because Javascript doesn't know it is an object, so it doesn't even know the existence of the method!
    const [expiration, setExpiration] = React.useState(defaultExpiration);

    // this is used to return to home when clicking update button
    const navigate = useNavigate();
    const toHome = () => {
        console.log("called submitUpdated item");
        // when clicking on a submit button, the default behaviour is submitting a form. With this method we prevent this.
        // when this function is called, we submit a new item, so we setSubmitting to true
        setSubmitting(true);
        // TODO: convertire timestamp in stringa yyyy-mm-dd
        let request = API_GATEWAY_ADDRESS + '/updateProduct?product_name=' + itemName.trim() + '&unit=' + Unit.toString(unit) + '&type=' + ProductType.toString(type) + '&quantity=' + quantity + '&expiration=' + expiration;
        console.log(request);
        fetch(request, {method: 'POST'})
            .then(r => r.json)
            .then(() => {
                setSubmitting(false);
                // we update the state of "itemName" to an empty string, to clean the text field.
                setItemName('');
            })
        navigate('/');
    }

    return (<Form onSubmit={() => toHome()}>
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
                        Update
                    </Button>
                </Row>
            </Container>
        </InputGroup>
    </Form>);
}

export default UpdateProductPage;