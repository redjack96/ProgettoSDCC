// this is called by the route /updatePantryPage by ...
import {useLocation, useNavigate} from "react-router-dom";
import React from "react";
import {Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import Navbar from "../Utils/Navbar";
import {PageHeader} from "../Utils/PageHeader";
import {API_GATEWAY_ADDRESS, ProductType, Timestamp, Unit} from "../../Services/Home";
import {MDBCard, MDBCardBody} from "mdb-react-ui-kit";
import {
    BackButton,
    ExpirationInput,
    NameInput,
    ProductTypeSelect,
    QuantityInput,
    TimesBoughtInput, TotalUseNumberInput,
    UnitSelect, UpdateButton,
    UseNumberInput
} from "../../Widgets/FormWidgets";

// this component defines the update pantry page
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
    const defaultExpiration = Timestamp.today();
    console.log(defaultExpiration);
    const [itemName, setItemName] = React.useState(item.item_name);
    const [type, setType] = React.useState(item.type);
    const [unit, setUnit] = React.useState(item.unit);
    const [quantity, setQuantity] = React.useState(item.quantity);
    // here we cannot use directly item.expiration.getOrderedDateString(), because Javascript doesn't know it is an object, so it doesn't even know the existence of the method!
    const [expiration, setExpiration] = React.useState(defaultExpiration);
    const [lastUsed, setLastUsed] = React.useState(Timestamp.today());
    const [useNumber, setUseNumber] = React.useState(item.useNumber);
    const [totalUseNumber, setTotalUseNumber] = React.useState(item.totalUseNumber);
    const [timesBought, setTimesBought] = React.useState(item.timesBought);
    const [buyDate, setBuyDate] = React.useState(Timestamp.today());

    // this is used to return to home when clicking update button
    const navigate = useNavigate();
    const toStorage = () => {
        console.log("called submitUpdated item");
        // when clicking on a submit button, the default behaviour is submitting a form. With this method we prevent this.
        // when this function is called, we submit a new item, so we setSubmitting to true
        let request = API_GATEWAY_ADDRESS + '/updateProductInStorage' + '/' + itemName.trim() + '/' + quantity +
            '/' + Unit.toString(unit) + '/' + ProductType.toString(type) + '/' + expiration + '/' + lastUsed + '/'
            + useNumber + '/' + totalUseNumber + '/' + timesBought + '/' + buyDate;
        console.log(request);
        fetch(request, {method: 'POST'})
            .then(r => r.json)
            .then(() => {
                // we update the state of "itemName" to an empty string, to clean the text field.
                setItemName('');
            })
        navigate('/productStoragePage');
    }

    const backFn = () => {
        navigate('/productStoragePage');
    }

    return (<Form onSubmit={() => toStorage()}>
        <InputGroup className="mb-3">
            {/*This is needed to write the name of the product*/}
            <Row className="mb-3">
                <NameInput itemName={itemName} setItemName={setItemName} isUpdate={true}/>
                <UnitSelect unit={unit} setUnit={setUnit} isUpdate={true}/>
                <ProductTypeSelect type={type} setType={setType} isUpdate={true}/>
                <QuantityInput quantity={quantity} setQuantity={setQuantity}/>
            </Row>
        </InputGroup>
        <InputGroup>
            <Row className="mb-3">
                <ExpirationInput expiration={expiration} setExpiration={setExpiration}/>
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
                <TimesBoughtInput timesBought={timesBought} setTimesBought={setTimesBought}/>
            </Row>
        </InputGroup>
        <InputGroup className="mb-3">
            <Row className="mb-3">
                <UseNumberInput useNumber={useNumber} setUseNumber={setUseNumber}/>
                <TotalUseNumberInput totalUseNumber={totalUseNumber} setTotalUseNumber={setTotalUseNumber}/>
            </Row>
        </InputGroup>
        <InputGroup className="mb-3">
            <Container>
                <Row className="mb-3">
                    <UpdateButton buttonText="Update in pantry"/>
                </Row>
                <Row>
                    <BackButton backFn={backFn}/>
                </Row>
            </Container>
        </InputGroup>
    </Form>);
}