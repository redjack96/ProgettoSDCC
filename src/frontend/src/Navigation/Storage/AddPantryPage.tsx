// this is called by the route /addPantryPage by ...
// import {useLocation} from "react-router-dom";
import React from "react";
import {Container, Form, InputGroup, Row} from "react-bootstrap";
import {PantryItem} from "../../Services/Storage";
import Navbar from "../Utils/Navbar";
import {PageHeader} from "../Utils/PageHeader";
import {API_GATEWAY_ADDRESS, ProductType, Timestamp, Unit} from "../../Services/Home";
import {MDBCard, MDBCardBody} from "mdb-react-ui-kit";
import {ExpirationInput, NameInput, ProductTypeSelect, QuantityInput, SubmitButton, UnitSelect} from "../../Widgets/FormWidgets";

// this is the definition of the addProductToPantry page.
export function AddPantryPage() {
    // const {state} = useLocation();
    // console.log("items: ", state.items)
    // const onAddItem = React.useCallback(
    //     (newItem: PantryItem) => {
    //         state.items.products.pushEntry(newItem)
    //     },
    //     [state.items],
    // );
    return (
        <Container>
            <Navbar/>
            <PageHeader pageName="Add a product in Pantry"/>
            <MDBCard className="form">
                <MDBCardBody>
                    {/*<AddPantryForm onAdd={onAddItem}/>*/}
                </MDBCardBody>
            </MDBCard>
        </Container>
    );
}

// This form allows to add a new product directly to pantry
export function AddPantryForm({onAdd}) {
    const [itemName, setItemName] = React.useState('');
    const [quantity, setQuantity] = React.useState(1);
    const [type, setType] = React.useState(ProductType.Other);
    const [unit, setUnit] = React.useState(Unit.Packet);
    const [expiration, setExpiration] = React.useState(Timestamp.today);
    // this state is the status of this component. If it is submitting, the item is being added. If not it is already added.
    const [submitting, setSubmitting] = React.useState(false);

    // this is used to return to home when clicking update button
    // const navigate = useNavigate();
    const addToStorage = e => {
        e.preventDefault();
        console.log("called submitAdded item");
        // when clicking on a submit button, the default behaviour is submitting a form. With this method we prevent this.
        // when this function is called, we submit a new item, so we setSubmitting to true
        setSubmitting(true);
        let request = API_GATEWAY_ADDRESS + '/addProductToStorage/' + itemName.trim() + '/' + quantity + '/' + Unit.toString(unit) + '/' + ProductType.toString(type) + '/' + expiration;
        console.log(request);
        fetch(request, {method: 'POST'})
            .then(response => response.json)
            .then(() => {
                // this is a callback
                onAdd(new PantryItem(itemName, quantity, type, unit, new Timestamp(new Date().getTime(), 0), new Timestamp(new Date().getTime(), 0),
                    1, 1, 1));
                setSubmitting(false);
                // we update the state of "itemName" to an empty string, to clean the text field.
                setItemName('');
            })
    };

    return (<Form onSubmit={addToStorage}>
        <InputGroup className="mb-3">
            {/*This is needed to write the name of the product*/}
            <Row className="mb-3">
                <NameInput itemName={itemName} setItemName={setItemName} isUpdate={false}/>
                <ExpirationInput expiration={expiration} setExpiration={setExpiration}/>
            </Row>
            <Row className="mb-3">
                <QuantityInput quantity={quantity} setQuantity={setQuantity}/>
                <UnitSelect unit={unit} setUnit={setUnit} isUpdate={false}/>
                <ProductTypeSelect type={type} setType={setType} isUpdate={false}/>
            </Row>
        </InputGroup>
        <InputGroup className="mb-3">
            <Container>
                <Row className="mb-3">
                    <SubmitButton itemName={itemName} submitting={submitting} buttonText="Add"/>
                </Row>
            </Container>
        </InputGroup>
    </Form>);
}