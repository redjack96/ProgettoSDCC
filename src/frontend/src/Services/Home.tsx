import {Button, ButtonGroup, Col, Container, Form, Image, Row} from 'react-bootstrap';
import React from 'react'
import '../App.css';
import images from '../Images/images.js';
import {useNavigate} from "react-router-dom";
import Navbar from "../Navigation/Utils/Navbar";
import {PageHeader} from "../Navigation/Utils/PageHeader";
import {MDBCard, MDBCardBody} from 'mdb-react-ui-kit';
import {ExpirationInput, NameInput, ProductTypeSelect, QuantityInput, UnitSelect} from "../Widgets/FormWidgets";
import {SimpleModalAlert} from "../Widgets/AlertWidgets";

function getList(setItems, setVoidMessage) {
    fetch(API_GATEWAY_ADDRESS + '/getList')
        .then(r => r.json())
        .then(itemsOrError => {
            if (itemsOrError.hasOwnProperty('products')) {
                setItems(itemsOrError)
                setVoidMessage("Nothing added to List! Add one when you're ready!")
            } else if (itemsOrError.hasOwnProperty('msg')) {
                console.log("Error: shopping_list service is down")
                setItems({
                    id: 0,
                    name: "",
                    products: []
                })
                setVoidMessage(itemsOrError.msg)
            }
        })
        .catch(e => console.log("Errore: " + e))
}

function Home() {
    const [loading, setLoading] = React.useState(false);
    const [voidMessage, setVoidMessage] = React.useState("Nothing added to List! Add one when you're ready!");
    const [items, setItems] = React.useState({
        id: 0,
        name: "",
        products: []
    });

    // called on page load, loads the entire list from shopping_list microservice
    React.useEffect(() => {
        if (!loading) {
            console.log("Reloading shopping list from server");
            setLoading(true);
            getList(setItems, setVoidMessage);
        }
    }, [items, loading]);

    // at first items.products is empty
    // after loading, useEffect will run and products will be populated

    // This removes only from the array state "items.products"
    const onItemRemoval = React.useCallback(
        item => {
            const i = items.products.findIndex(value => value.product_name === item.product_name)
            setItems({
                ...items,
                products: [...items.products.slice(0, i), ...items.products.slice(i + 1)]
            });
            setLoading(false);
        },
        [items],
    );

    const onItemUpdate = React.useCallback(
        item => {
            const index = items.products.findIndex(i => i.id === item.id);
            // console.log("The index to update is" + index);
            setItems({
                ...items,
                products: [
                    ...items.products.slice(0, index),
                    item,
                    ...items.products.slice(index + 1),
                ]
            });
            setLoading(false);
        },
        [items],
    );

    const onBuyAll = React.useCallback(
        () => {
            console.log("BuyAll")
            fetch(API_GATEWAY_ADDRESS + '/buyProductsInCart', {method: 'POST'})
                .then(r => {
                    return r.json();
                })
                .catch(e => console.log("Errore: " + e))

            console.log("reloading shopping list from server");
            getList(setItems, setVoidMessage);
            // show alert
            setShowAlert(true);
        }, [])

    // this only sets the new state. To show the new Item, a new ItemDisplay component must be added
    const onNewItem = React.useCallback(
        (newItem: Item) => {
            if (loading) {
                try {
                    setItems({
                        ...items,
                        products: [...items.products, newItem]
                    });
                } catch {
                    setItems({
                        id: 0,
                        name: "",
                        products: []
                    });
                    setVoidMessage("Error: shopping_list service is down")
                }
                setLoading(false);
            }
        },
        [items, loading],
    );

    let [showAlert, setShowAlert] = React.useState(false);

    return (
        <Container>
            <Navbar/>
            <PageHeader pageName="Shopping list"/>
            <Row spacing={2}>
                <Col xl={6}>
                    <MDBCard className="form mb-3">
                        <MDBCardBody>
                            <h2>Add new item</h2>
                            <AddItemForm onNewItem={onNewItem}/>
                        </MDBCardBody>
                    </MDBCard>
                    <MDBCard className="form mb-3">
                        <MDBCardBody>
                            <h2>Buy Products</h2>
                            <Row>
                                <Button
                                    className="mt-3"
                                    variant="success"
                                    onClick={onBuyAll}
                                    aria-label="Buy Products in cart"
                                    disabled={!items.products.length}
                                >
                                    Buy all in cart
                                </Button>
                            </Row>
                            <SimpleModalAlert showAlert={showAlert} setShowAlert={setShowAlert} message={"Added products to pantry."}/>
                        </MDBCardBody>
                    </MDBCard>
                </Col>
                <Col xl={6} className="wrapper">

                    <ShoppingList items={items} handleRemoval={onItemRemoval} handleUpdate={onItemUpdate} voidMessage={voidMessage}/>

                </Col>
            </Row>
        </Container>
    );
}

// this will get always the correct IP typed in the address bar
export const API_GATEWAY_ADDRESS = "http://" + window.location.hostname + ":8007"

export enum Unit {
    Bottle,
    Packet,
    Kg,
    Grams,
}

export enum ProductType {
    Meat,
    Fish,
    Fruit,
    Vegetable,
    Drink,
    Other,
}

export class Item {
    constructor(itemName: string, quantity: number, unit: Unit, type: ProductType, expiration: Timestamp) {
        this.product_name = itemName;
        this.quantity = quantity;
        this.unit = unit;
        this.type = type;
        this.expiration = expiration;
        this.checked_out = false;
        this.added_to_cart = false;
    }

    added_to_cart: boolean;
    checked_out: boolean;
    expiration: Timestamp;
    product_name: string;
    quantity: number;
    type: ProductType;
    unit: Unit;

    addToCart() {
        this.added_to_cart = true;
    }

    removeFromCart() {
        this.added_to_cart = false;
    }

    static default(): Item {
        return new Item("Unknown", 0, Unit.Packet, ProductType.Other, Timestamp.default());
    }

    toString() {
        return `Item product_name: (${this.product_name} quantity: ${this.quantity} unit: ${this.unit} type: ${this.type} expiration: ${this.expiration} checked_out: ${this.checked_out} added_to_cart: ${this.added_to_cart})`
    }
}

export namespace Unit {
    export function toString(unit: Unit): string {
        return Unit[unit];
    }

    export function parse(unitString: string): Unit {
        console.log(Unit[unitString]);
        return Unit[unitString];
    }

    export function parseFromInt(unitInt: number): string {
        return Unit[unitInt];
    }
}

export namespace ProductType {
    export function toString(type: ProductType): string {
        return ProductType[type];
    }

    export function parse(type: string): ProductType {
        console.log(ProductType[type]);
        return ProductType[type];
    }

    export function parseFromInt(productInt: number): string {
        return ProductType[productInt];
    }

    export function imageFromType(typeInt: number) {
        switch (typeInt) {
            case 0: {
                return images.meat;
            }
            case 1: {
                return images.fish;
            }
            case 2: {
                return images.fruit;
            }
            case 3: {
                return images.veggies;
            }
            case 4: {
                return images.drinks;
            }
            default: {
                return images.other;
            }
        }
    }
}


// Defining our Timestamp class
export class Timestamp {
    constructor(seconds: number, nanos?: number) {
        this.seconds = seconds;
        if (nanos === undefined) {
            this.nanos = 0;
        } else {
            this.nanos = nanos;
        }
    }

    seconds: number;
    nanos: number;

    getSeconds() {
        return this.seconds;
    }

    getNanos() {
        return this.nanos;
    }

    getShowString(): string {
        let date = new Date(this.getSeconds() * 1000);
        return date.toDateString()
    }

    public getOrderedDateString(): string {
        let d = new Date(this.seconds);
        let fullYear = d.getFullYear();
        let month = d.getMonth();
        let day = d.getDate();
        return fullYear + "-" + month + "-" + day;
    }

    public static today(): string {
        let today = new Date();
        let day = today.getDate();
        let month = today.getMonth();
        let year = today.getFullYear()
        return year + "-" + month + "-" + day;
    }

    public static todayPlus(years: number, months: number, days: number): string {
        let today = new Date();
        today.setDate(today.getDate() + days);
        today.setFullYear(today.getFullYear() + years);
        today.setMonth(today.getMonth() + months);
        let st = today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
        console.log("today plus", st);
        return st;
    }

    public static todayMinus(years: number, months: number, days: number): string {
        let today = new Date();
        today.setDate(today.getDate() - days);
        today.setFullYear(today.getFullYear() - years);
        today.setMonth(today.getMonth() - months);
        return today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
    }

    static default() {
        return new Timestamp(0, 0);
    }

    static from(expiration: string) {
        console.log(expiration);
        let d = Date.parse(expiration);
        return new Timestamp(d.valueOf() / 1000, 0);
    }
}


function ShoppingList({items, voidMessage, handleUpdate, handleRemoval}) {
    return (
        <Container className="cardContainer">
            {items.products.length === 0 && (
                <p className="text-center">{voidMessage}</p>
            )}
            {items.products.map((item, index) => (
                <ItemDisplay
                    item={item}
                    key={index}
                    onItemUpdate={handleUpdate}
                    onItemRemoval={handleRemoval}
                />
            ))}
        </Container>
    );
}

// This form enables the user to add a new item.
// The parameter is a function callback, called when the add button si clicked.
function AddItemForm({onNewItem}) {
    // this state is the new item written in the textbox
    // const [item, setItem] = React.useState(Item.default())
    const [itemName, setItemName] = React.useState('');
    const [quantity, setQuantity] = React.useState(1);
    const [type, setType] = React.useState(ProductType.Other);
    const [unit, setUnit] = React.useState(Unit.Packet);
    const [expiration, setExpiration] = React.useState(Timestamp.today());
    // this state is the status of this component. If it is submitting, the item is being added. If not it is already added.
    const [submitting, setSubmitting] = React.useState(false);

    // this function will be called by the submit button!
    const submitNewItem = e => {
        // when clicking on a submit button, the default behaviour is submitting a form. With this method we prevent this.
        e.preventDefault();
        // when this function is called, we submit a new item, so we setSubmitting to true
        setSubmitting(true);
        let trimmedItemName = itemName.trim();
        let request = API_GATEWAY_ADDRESS + '/addProduct/' + trimmedItemName+ '/' + quantity + '/' + Unit.toString(unit) + '/' + ProductType.toString(type) + '/' + expiration;
        console.log(request);
        fetch(request, {method: 'POST'})
            .then(r => r.json)
            .then(() => {
                // we call the callback passed as a parameter (!) to this component. We give it the item name to add. For us, it will be an object
                onNewItem(new Item(trimmedItemName, quantity, unit, type, Timestamp.from(expiration)));
                console.log("added " + trimmedItemName);
                // we are done submitting the item
                setSubmitting(false);
                // we update the state of "newItem" to an empty string, to clean the text field.
                setItemName('');
            });
    };
    // We return a Form with an input group that is a Control (textfield) and a Button.
    return (
        <Form onSubmit={submitNewItem}>
            <Col>
                <Row className="mb-3">
                    <Col>
                        <NameInput itemName={itemName} setItemName={setItemName} isUpdate={false}/>
                    </Col>
                    <Col>
                        <ExpirationInput expiration={expiration} setExpiration={setExpiration}/>
                    </Col>
                    <Col>
                        <QuantityInput quantity={quantity} setQuantity={setQuantity}/>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <UnitSelect unit={unit} setUnit={setUnit} isUpdate={false}/>
                    </Col>
                    <Col>
                        <ProductTypeSelect type={type} setType={setType} isUpdate={false}/>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Button
                        type="submit"
                        variant="success"
                        disabled={!itemName.trim().length}
                        className={submitting ? 'disabled' : ''}
                    >
                        {submitting ? 'Adding...' : 'Add to list'}
                    </Button>
                </Row>
            </Col>
        </Form>
    )
}

/**
 * This component contains the item information and shows them to the user
 * @param item: it is the item OBJECT to display
 * @param onItemUpdate: the callback to call when updating the itemDisplay
 * @param onItemRemoval: the callback to call when removing the itemDisplay
 * @returns {JSX.Element}
 * @constructor
 */
function ItemDisplay({item, onItemUpdate, onItemRemoval}) {

    // called when clicking the addToCart button.
    const addToCart = () => {
        // Watch out! Here to define the string we use the ` NOT ' !!!
        let request = API_GATEWAY_ADDRESS + `/addToCart/${item.product_name}/${Unit.toString(item.unit)}/${ProductType.toString(item.type)}`;
        console.log(request);
        fetch(request, {method: 'POST'})
            .then(r => r.json())
            // here it will receive the json object given in input?
            .then(() => onItemUpdate(item))
    }
    // called when clicking the removeFromCart button
    const removeFromCart = () => {
        // Watch out! Here we use the ` NOT ' !!!
        fetch(API_GATEWAY_ADDRESS + `/removeFromCart/${item.product_name}/${Unit.toString(item.unit)}/${ProductType.toString(item.type)}`, {method: 'POST'})
            .then(r => r.json())
            // here it will receive the json object given in input?
            .then(() => onItemUpdate(item))
    }

    // called when removing an item
    const removeItem = () => {
        fetch(API_GATEWAY_ADDRESS + `/removeProduct/${item.product_name}/${Unit.toString(item.unit)}/${ProductType.toString(item.type)}`, {method: 'POST'})
            .then(r => {
                console.log(r.json());
                return r;
            })
            .then(() => onItemRemoval(item))
            .catch((err) => console.log(err));
    };

    const navigate = useNavigate();

    const toProductPage = () => {
        navigate('/updateProductPage', {
            state: {
                item: item,
            }
        });
    }

    return (
        <MDBCard className="mb-3">
            <MDBCardBody className="card-body">
                <ItemInfo item={item}/>
                <Container>
                    <ButtonGroup>
                        <Button
                            size="sm"
                            variant="danger"
                            onClick={removeItem}
                            aria-label="Remove the product"
                        >
                            Remove
                        </Button>
                        <Button
                            size="sm"
                            variant="outline-info"
                            onClick={addToCart}
                            aria-label="Add to cart"
                        >
                            Add to cart
                        </Button>
                        <Button
                            size="sm"
                            variant="outline-info"
                            onClick={removeFromCart}
                            aria-label="Remove From Cart"
                        >
                            Remove from cart
                        </Button>
                        <Button
                            size="sm"
                            variant="outline-info"
                            onClick={() => toProductPage()}
                            aria-label="Update Product"
                        >
                            Update
                        </Button>
                    </ButtonGroup>

                </Container>
            </MDBCardBody>
        </MDBCard>
    );
}

function ItemInfo({item}) {

    const extractAndReformatDateToShow = (expiration: Timestamp) => {
        let timestamp = new Timestamp(expiration.seconds);
        return timestamp.getShowString();
    }

    return (
        <Container>
            <h4 className="card-title font-weight-bold">{item.product_name}</h4>
            <hr/>
            <Row className="card-body">
                <Col>
                    <Row>
                        <h6><strong>Quantity:</strong> {item.quantity} {Unit.parseFromInt(item.unit)}</h6>
                    </Row>
                    <Row>
                        <h6><strong>Expiration:</strong> {extractAndReformatDateToShow(item.expiration)}</h6>
                    </Row>
                    <Row>
                        <h6><strong>Added to Cart: </strong> {item.added_to_cart ? 'Yes' : 'No'}</h6>
                    </Row>
                </Col>
                <Col xs={3}>
                    <Image src={ProductType.imageFromType(item.type)} alt="type image" aria-label={item.type}/>
                </Col>
            </Row>
        </Container>
    )
}


export default Home;