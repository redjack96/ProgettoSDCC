import React from 'react'
import {useLocation, useNavigate} from "react-router-dom";
import {Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import {API_GATEWAY_ADDRESS, Item, ProductType, Timestamp, Unit} from "../../Services/Home";
import Navbar from "../Utils/Navbar";
import {PageHeader} from "../Utils/PageHeader";
import {MDBCard, MDBCardBody} from "mdb-react-ui-kit";
import {BackButton, ExpirationInput, NameInput, ProductTypeSelect, QuantityInput, UnitSelect, UpdateButton} from "../../Widgets/FormWidgets";

// this is called by the route /updateProductPage by the ItemDisplay's Update button
function UpdateProductPage() {
    const location = useLocation();
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
    const defaultExpiration = Timestamp.today();
    const [itemName, setItemName] = React.useState(item.product_name);
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
        let request = API_GATEWAY_ADDRESS + '/updateProduct?product_name=' + itemName.trim() + '&unit=' + Unit.toString(unit) + '&type=' + ProductType.toString(type) + '&quantity=' + quantity + '&expiration=' + expiration;
        console.log(request);
        fetch(request, {method: 'POST'})
            .then(r => r.json)
            .then(() => {
                // we update the state of "itemName" to an empty string, to clean the text field.
                setItemName('');
            })
        navigate('/');
    }

    const backFn = () => {
        navigate('/');
    }

    return (<Form onSubmit={() => toHome()}>
        <InputGroup className="mb-3">
            {/*This is needed to write the name of the product*/}
            <Row container>
                <Col item className="mb-3">
                    <NameInput itemName={itemName} setItemName={setItemName} isUpdate={true} isUse={false}/>
                </Col>
                <Col item className="mb-3">
                    <UnitSelect unit={unit} setUnit={setUnit} isUpdate={true}/>
                </Col>
                <Col item className="mb-3">
                    <ProductTypeSelect type={type} setType={setType} isUpdate={true}/>
                </Col>
                <Col item className="mb-3">
                    <QuantityInput quantity={quantity} setQuantity={setQuantity}/>
                </Col>
                <Col item className="mb-3">
                    <ExpirationInput expiration={expiration} setExpiration={setExpiration}/>
                </Col>
            </Row>
        </InputGroup>
        <Row className="mb-3">
            <UpdateButton buttonText="Update"/>
        </Row>
        <Row className="mb-3">
            <BackButton backFn={() => backFn()}/>
        </Row>
    </Form>);
}

export default UpdateProductPage;