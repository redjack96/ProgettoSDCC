import {Container, Button, Row, Col, Form, InputGroup, Image, ButtonGroup} from 'react-bootstrap';
import React from 'react'
import '../App.css';
import images from '../Images/images.js';
import {useNavigate} from "react-router-dom";
import Navbar from "../Navigation/Utils/Navbar";
import {PageHeader} from "../Navigation/Utils/PageHeader";
import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBBtn
} from 'mdb-react-ui-kit';
import {ExpirationInput, NameInput, ProductTypeSelect, QuantityInput, UnitSelect} from "../Widgets/FormWidgets";

function Home() {
    const [loading, setLoading] = React.useState(false)
    const [voidMessage, setVoidMessage] = React.useState("Nothing added to List! Add one when you're ready!");
    const [items, setItems] = React.useState({
        id: 0,
        name: "",
        products: []
    });

    // called on page load, loads the entire list from shopping_list microservice
    React.useEffect(() => {
        if (!loading) {
            console.log("reloading list from server");
            setLoading(true);
            fetch(API_GATEWAY_ADDRESS + '/getList')
                .then(r => {
                    let x = r.json();
                    console.log(x);
                    return x;
                })
                .then(itemsOrError => {
                    try {
                        setItems(itemsOrError)
                        setVoidMessage("Nothing added to List! Add one when you're ready!")
                    } catch {
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
    }, [items]);

    // This removes only from the array state "items.products"
    const onItemRemoval = React.useCallback(
        item => {
            const i = items.products.findIndex(value => value.product_name === item.product_name)
            console.log("index to remove = " + i);
            // const index = items.findIndex(i => i.id === item.id);
            setItems({
                ...items,
                products: [...items.products.slice(0, i), ...items.products.slice(i + 1)]
            });
            setLoading(false);
        },
        [items.products],
    );

    console.log(items.products);

    const onItemUpdate = React.useCallback(
        item => {
            const index = items.products.findIndex(i => i.id === item.id);
            console.log("The index to update is" + index);
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
                    let x = r.json();
                    console.log(x);
                    return x;
                })
                .catch(e => console.log("Errore: " + e))

            console.log("reloading list from server");
            fetch(API_GATEWAY_ADDRESS + '/getList')
                .then(r => {
                    let x = r.json();
                    console.log(x);
                    return x;
                })
                .then(itemsOrError => {
                    try {
                        setItems(itemsOrError)
                        setVoidMessage("Nothing added to List! Add one when you're ready!")
                    } catch {
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
        , [items])

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
        [items.products],
    );
    return (
        <Container>
            <Navbar/>
            <PageHeader pageName="Shopping list"/>
            <Row>
                <Col>
                    <Row className="mb-3">
                        <MDBCard className="form">
                            <MDBCardBody>
                                <h2>Add new item</h2>
                                <AddItemForm onNewItem={onNewItem}/> {/*FIXME: c'e' qualcosa che non va qui, quando shopping list è down!*/}
                            </MDBCardBody>
                        </MDBCard>
                    </Row>
                    <Row className="mb-3">
                        <MDBCard className="form">
                            <MDBCardBody>
                                <h2>Buy something</h2>
                                <ButtonGroup as={Col}>
                                    <Button
                                        size="sm"
                                        variant="success"
                                        onClick={onBuyAll}
                                        aria-label="Buy in cart"
                                        disabled={!items.products.length}
                                    >
                                        Buy all in cart
                                    </Button>
                                </ButtonGroup>
                            </MDBCardBody>
                        </MDBCard>
                    </Row>
                </Col>
                <Col className="fixed scrollable">
                    <ShoppingList items={items} handleRemoval={onItemRemoval} handleUpdate={onItemUpdate} voidMessage={voidMessage}/>
                </Col>
            </Row>
        </Container>
    );
}


export const API_GATEWAY_ADDRESS = "http://localhost:8007"
// TODO: Qua bisogna mettere un indirizzo diverso da localhost!!! Forse dobbiamo usare AWS.
//  Puoi provare sul tuo cellulare (connesso alla stessa rete) se sostituisci localhost con l'ip assegnato dal router wifi (es. 192.168.1.9)

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
                console.log("Meat");
                return images.meat;
            }
            case 1: {
                console.log("Fish");
                return images.fish;
            }

            case 2: {
                console.log("Fruit");
                return images.fruit;
            }

            case 3: {
                console.log("Veg");
                return images.veggies;
            }
            case 4: {
                console.log("Drink");
                return images.drinks;
            }
            default: {
                console.log("Other");
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
        let day = today.getDate().toString();
        let month = today.getMonth();
        let year = today.getFullYear()
        return year + "-" + month + "-" + day;
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
        <React.Fragment>
            <br/><br/>
            {items.products.length === 0 && (
                <p className="text-center">{voidMessage}</p>
            )}
            {items.products.map(item => (
                <ItemDisplay
                    item={item}
                    key={items.products.indexOf(item)}
                    onItemUpdate={handleUpdate}
                    onItemRemoval={handleRemoval}
                />
            ))}
            <br/>
        </React.Fragment>
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
    const [expiration, setExpiration] = React.useState(Timestamp.today()); // FIXME: forse qua ci vuole un numero, non una stringa.
    // this state is the status of this component. If it is submitting, the item is being added. If not it is already added.
    const [submitting, setSubmitting] = React.useState(false);

    // this function will be called by the submit button!
    const submitNewItem = e => {
        // when clicking on a submit button, the default behaviour is submitting a form. With this method we prevent this.
        e.preventDefault();
        // when this function is called, we submit a new item, so we setSubmitting to true
        setSubmitting(true);
        // TODO: convertire timestamp in stringa yyyy-mm-dd
        let request = API_GATEWAY_ADDRESS + '/addProduct/' + itemName.trim() + '/' + quantity + '/' + Unit.toString(unit) + '/' + ProductType.toString(type) + '/' + expiration;
        console.log(request);
        fetch(request, {method: 'POST'})
            .then(r => r.json)
            .then(() => {
                // we call the callback passed as a parameter (!) to this component. We give it the item name to add. For us, it will be an object
                onNewItem(new Item(itemName, quantity, unit, type, Timestamp.from(expiration)));
                console.log("added " + itemName.trim());
                // we are done submitting the item
                setSubmitting(false);
                // we update the state of "newItem" to an empty string, to clean the text field.
                setItemName('');
            })
    }
    // We return a Form with an input group that is a Control (textfield) plus a Button.
    // TODO: We will need to add also the quantity, type and expiration fields.
    return (
        <Form onSubmit={submitNewItem}>
            <InputGroup>
                <Row className="mb-3">
                    <NameInput itemName={itemName} setItemName={setItemName} />
                    <ExpirationInput expiration={expiration} setExpiration={setExpiration} />
                </Row>
                <Row className="mb-3">
                    <QuantityInput quantity={quantity} setQuantity={setQuantity} />
                    <UnitSelect unit={unit} setUnit={setUnit} />
                </Row>
                <Row className="mb-3">
                    <ProductTypeSelect type={type} setType={setType} />
                    <Col md="auto" style={{'margin':'30px'}}>
                        <Button
                            type="submit"
                            variant="success"
                            disabled={!itemName.trim().length}
                            className={submitting ? 'disabled' : ''}
                        >
                            {submitting ? 'Adding...' : 'Add to shopping list'}
                        </Button>
                    </Col>
                </Row>
            </InputGroup>
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

    // called when clicking the addToCart button. TODO: This button must be also hidden when clicked and the remove from cart shown.!
    const addToCart = () => {
        // Watch out! Here we use the ` NOT ' !!!
        let request = API_GATEWAY_ADDRESS + `/addToCart/${item.product_name}/${Unit.toString(item.unit)}/${ProductType.toString(item.type)}`;
        console.log(request);
        fetch(request, {method: 'POST'})
            .then(r => r.json())
            // here it will receive the json object given in input?
            .then(() => onItemUpdate(item)) // FIXME: qua ho modificato rispetto a then(onItemUpdate) perché la risposta che riceviamo dall'API non e' un oggetto, ma un messaggio
    }
    // called when clicking the removeFromCart button
    const removeFromCart = () => {
        // Watch out! Here we use the ` NOT ' !!!
        fetch(API_GATEWAY_ADDRESS + `/removeFromCart/${item.product_name}/${Unit.toString(item.unit)}/${ProductType.toString(item.type)}`, {method: 'POST'})
            .then(r => r.json())
            // here it will receive the json object given in input?
            .then(() => onItemUpdate(item)) // TODO: forse bisogna farsi restituire l'item da rust e non un messaggio per dire ok fatto!
        // FIXME: qua ho modificato rispetto a then(onItemUpdate) perché la risposta che riceviamo dall'API non e' un oggetto, ma un messaggio
    }

    // called when removing an item
    const removeItem = () => {
        // TODO: qua andrebbe aggiunto anche unit e type.
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
                // id: 1,
                // name: 'Benissimo! Aggiorniamo ' + item.product_name,
                item: item,
            }
        });
    }

    console.log("item is added to cart? " + item.added_to_cart);
    return (
        <div className="col center">
            <div className="card">
                {/*<img src="../res/images/Avenue-of-the-Baobobs-Madagascar 2.png" className="card-img-top" alt="product-image"/>*/}
                <div className="card-body">
                    <ItemInfo item={item}/>
                    {/*<button type="submit" name="viewinfo" className="btn btn-primary" value="${btninfoid}">More Info...</button>*/}
                    {/*<AddButton/>*/}
                    <Container>
                        <ButtonGroup>
                            <Button
                                size="sm"
                                variant="danger"
                                onClick={removeItem}
                                aria-label="Rimuovi il prodotto"
                            >
                                Remove
                            </Button>
                            {/*<Checkbox label={"Add to cart"} onFunc={addToCart} offFunc={removeFromCart}/>*/}
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
                </div>
            </div>
        </div>
    );
}

function ItemInfo({item}) {

    const extractAndReformatDateToShow = (expiration: Timestamp) => {
        console.log(expiration);
        let timestamp = new Timestamp(expiration.seconds);
        // Timestamp(sec, nsec) -> Date -> DateString (dd-mm-yyyy)
        console.log(timestamp);
        console.log(timestamp.getShowString());
        // let ts =  new Timestamp(timestamp);
        // console.log(ts);
        // let date = new Date(ts.getSeconds());
        // console.log(date);
        // console.log(date.toDateString());
        return timestamp.getShowString();
    }

    return (
        <Container>
            <h4 className="card-title font-weight-bold">{item.product_name}</h4>
            <hr/>
            <Row className="card-body">
                <Col>
                    <Row>
                        <h6 className="font-weight-bold">Quantity:</h6>
                        <h6>&nbsp;&nbsp;{item.quantity}</h6> {/*&nbsp; inserisce uno spazio*/}
                    </Row>
                    <Row>
                        <h6 className="font-weight-bold">Unit:</h6>
                        <h6>&nbsp;&nbsp;{Unit.parseFromInt(item.unit)}</h6> {/*&nbsp; inserisce uno spazio*/}
                    </Row>
                    <Row>
                        <h6 className="font-weight-bold">Expiration:</h6>
                        <h6>&nbsp;&nbsp;{extractAndReformatDateToShow(item.expiration)}</h6> {/*&nbsp; inserisce uno spazio*/}
                    </Row>
                    <Row>
                        <h6 className="font-weight-bold">Added to Cart:</h6>
                        <h6>&nbsp;&nbsp;{item.added_to_cart ? 'Yes' : 'No'}</h6> {/*&nbsp; inserisce uno spazio*/}
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