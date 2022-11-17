import React from 'react'
import {useLocation, useNavigate} from "react-router-dom";
import {Button, Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import {API_GATEWAY_ADDRESS, Item, ProductType, Timestamp, Unit} from "../../Services/Home";
import Navbar from "../Utils/Navbar";
import {PageHeader} from "../Utils/PageHeader";
import {MDBCard, MDBCardBody} from "mdb-react-ui-kit";
import {ExpirationInput, NameInput, ProductTypeSelect, QuantityInput, SubmitButton, UnitSelect} from "../../Widgets/FormWidgets";

// this is called by the route /updateProductPage by the ItemDisplay's Update button
function UpdateProductPage() {
    const location = useLocation();
    const productName = location.state.item.product_name;
    return (
        <Container>
            <Navbar/>
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
                <NameInput itemName={itemName} setItemName={setItemName}/>
                <ExpirationInput expiration={expiration} setExpiration={setExpiration}/>
            </Row>
            <Row className="mb-3">
                <QuantityInput quantity={quantity} setQuantity={setQuantity}/>
                <UnitSelect unit={unit} setUnit={setUnit}/>
                <ProductTypeSelect type={type} setType={setType}/>
            </Row>
            <Container>
                <Row className="mb-3">
                    <SubmitButton itemName={itemName} submitting={submitting} buttonText="Update"/>
                </Row>
            </Container>
        </InputGroup>
    </Form>);
}

export default UpdateProductPage;