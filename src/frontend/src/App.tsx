import {Container, Button, Row, Col, Form, InputGroup, Image, ButtonGroup} from 'react-bootstrap';
import React from 'react'
import './App.css';
import Navbar from './Navigation/Navbar';
import images from './Images/images.js';
import {AddButton, DeleteButton} from "./Widgets/Button";

const Unit = {
    Bottle: 'Bottle',
    Kg: 'Kg',
    Grams: 'Grams',
    Packet: 'Packet'
}

const ProductType = {
    Meat: 'Meat',
    Fish: 'Fish',
    Fruit: 'Fruit',
    Vegetable: 'Vegetable',
    Drink: 'Drink',
    Other: 'Other'
}

export function App() {
    return (
        <Container>
            <Container>
                <Navbar/>
            </Container>
            <Container>
                <Row>
                    <Col md={{offset: 3, span: 6}}>
                        <ShoppingListCard/>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}


// Defining our Timestamp class
class Timestamp {
    seconds: number;
    nanos: number;

    getSeconds() {
        return this.seconds;
    }

    getNanos() {
        return this.nanos;
    }
}

function ShoppingListCard() {
    const [loading, setLoading] = React.useState(false)
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
            fetch('http://localhost:8007/getList')
                .then(r => {
                    let x = r.json();
                    console.log(x);
                    return x;
                })
                .then(setItems)
                .catch(e => console.log("Errore: " + e))
        }
    }, [items]);

    // this only sets the new state. To show the new Item, a new ItemDisplay component must be added
    const onNewItem = React.useCallback(
        newItem => {
            setItems({
                ...items,
                products: [...items.products, newItem]
            });
            setLoading(false);
        },
        [items.products],
    );

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
        [items.products],
    );

    return (
        <React.Fragment>
            <AddItemForm onNewItem={onNewItem}/>
            {items.products.length === 0 && (
                <p className="text-center">Nessun prodotto! Aggiungine uno quando vuoi.</p>
            )}
            {items.products.map(item => (
                <ItemDisplay
                    item={item}
                    key={items.products.indexOf(item)}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
            {/*{rows}*/}
        </React.Fragment>
    );
}

// This form enables the user to add a new item.
// The parameter is a function callback, called when the add button si clicked.
function AddItemForm({onNewItem}) {
    // this state is the new item written in the textbox
    const [newItem, setNewItem] = React.useState('');
    const [quantity, setQuantity] = React.useState(1);
    const [type, setType] = React.useState(ProductType.Other);
    const [unit, setUnit] = React.useState(Unit.Packet);
    const [expiration, setExpiration] = React.useState('9999-12-31'); // OTHERS
    // this state is the status of this component. If it is submitting, the item is being added. If not it is already added.
    const [submitting, setSubmitting] = React.useState(false);

    // this function will be called by the submit button!
    const submitNewItem = e => {
        // when clicking on a submit button, the default behaviour is submitting a form. With this method we prevent this.
        e.preventDefault();
        // when this function is called, we submit a new item, so we setSubmitting to true
        setSubmitting(true);
        console.log('http://localhost:8007/addProduct/' + newItem.trim() + '/' + quantity + '/' + unit + '/' + type + '/' + expiration);
        fetch('http://localhost:8007/addProduct/' + newItem.trim() + '/' + quantity + '/' + unit + '/' + type + '/' + expiration, {method: 'POST'})
            .then(r => r.json)
            .then(() => {
                // we call the callback passed as a parameter (!) to this component. We give it the item name to add. For us, it will be an object
                onNewItem(newItem.trim());
                console.log("added " + newItem.trim());
                // we are done submitting the item
                setSubmitting(false);
                // we update the state of "newItem" to an empty string, to clean the text field.
                setNewItem('');
            })
    }

    const parseToType = typeString => {
        switch (typeString) {
            case "Meat": {
                console.log("Meat");
                return ProductType.Meat;
            }
            case "Fish": {
                console.log("Fish");
                return ProductType.Fish;
            }
            case "Fruit": {
                console.log("Fruit");
                return ProductType.Fruit;
            }
            case "Vegetable": {
                console.log("Veg");
                return ProductType.Vegetable;
            }
            case "Drink": {
                console.log("Drink");
                return ProductType.Drink;
            }
            default: {
                console.log("Other");
                return ProductType.Other;
            }

        }
    }

    const parseToUnit = unitString => {
        switch (unitString) {
            case "Bottle": {
                console.log("Bottle");
                return Unit.Bottle;
            }
            case "Packet": {
                console.log("Packet");
                return Unit.Packet;
            }
            case "Kg": {
                console.log("Kg");
                return Unit.Kg;
            }
            case "Grams": {
                console.log("Grams");
                return Unit.Grams;
            }
        }
    }

    // We return a Form with an input group that is a Control (textfield) plus a Button.
    // TODO: We will need to add also the quantity, type and expiration fields.
    return (
        <Form onSubmit={submitNewItem}>
            <InputGroup className="mb-3">{/* TODO: a cosa serve? */}
                {/*This is needed to write the name of the product*/}
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridName">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                            value={newItem.trim()}
                            onChange={e => setNewItem(e.target.value)}
                            type="text"
                            placeholder="New Item"
                            aria-describedby="basic-addon1"
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formExpirationDate">
                        <Form.Label>Expiration Date</Form.Label>
                        <Form.Control
                            value={expiration}
                            onChange={e => setExpiration(e.target.value)}
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
                            type="text"
                            placeholder="Quantity"
                            aria-describedby="basic-addon1"
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formSelectUnit">
                        <Form.Label>Unit</Form.Label>
                        <Form.Control as="select" onChange={e => setUnit(parseToUnit(e.target.value))}>
                            <option>Select unit...</option>
                            <option>Kg</option>
                            <option>Grams</option>
                            <option>Packet</option>
                            <option>Bottle</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formSelectType">
                        <Form.Label>Type</Form.Label>
                        <Form.Control as="select" onChange={e => setType(parseToType(e.target.value))}>
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
                <Button
                    type="submit"
                    variant="success"
                    disabled={!newItem.trim().length}
                    className={submitting ? 'disabled' : ''}
                >
                    {submitting ? 'Adding...' : 'Aggiungi.'}
                </Button>
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
        fetch(`http://localhost:8007/addToCart/${item.product_name}/${item.unit}/${item.type}`, {method: 'POST'})
            .then(r => r.json())
            // here it will receive the json object given in input?
            .then(() => onItemUpdate(item)) // FIXME: qua ho modificato rispetto a then(onItemUpdate) perché la risposta che riceviamo dall'API non e' un oggetto, ma un messaggio
    }
    // called when clicking the removeFromCart button
    const removeFromCart = () => {
        // Watch out! Here we use the ` NOT ' !!!
        fetch(`http://localhost:8007/removeFromCart/${item.product_name}/${item.unit}/${item.type}`, {method: 'POST'})
            .then(r => r.json())
            // here it will receive the json object given in input?
            .then(() => onItemUpdate(item)) // TODO: forse bisogna farsi restituire l'item da rust e non un messaggio per dire ok fatto!
        // FIXME: qua ho modificato rispetto a then(onItemUpdate) perché la risposta che riceviamo dall'API non e' un oggetto, ma un messaggio
    }

    // called when removing an item
    const removeItem = () => {
        // TODO: qua andrebbe aggiunto anche unit e type.
        fetch(`http://localhost:8007/removeProduct/${item.product_name}`, {method: 'POST'})
            .then(r => {
                console.log(r.json());
                return r;
            })
            .then(() => onItemRemoval(item))
            .catch((err) => console.log(err));
    };


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
                            <Button
                                size="sm"
                                variant="outline-info"
                                onClick={addToCart}
                                aria-label="Add to cart"
                            >
                                Add to cart
                            </Button>
                        </ButtonGroup>
                    </Container>
                </div>
            </div>
        </div>
    );
}

function ItemInfo({item}) {
    const parseFromType = typeInt => {
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

    const parseFromUnit = unitInt => {
        switch (unitInt) {
            case 0: {
                console.log("Bottle");
                return Unit.Bottle;
            }
            case 1: {
                console.log("Packet");
                return Unit.Packet;
            }

            case 2: {
                console.log("Kg");
                return Unit.Kg;
            }

            case 3: {
                console.log("Grams");
                return Unit.Grams;
            }
        }
    }

    const extractDate = timestamp => {
        let ts = Object.assign(new Timestamp(), timestamp).getSeconds();
        let date = new Date(ts);
        return date.toDateString()
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
                        <h6>&nbsp;&nbsp;{parseFromUnit(item.unit)}</h6> {/*&nbsp; inserisce uno spazio*/}
                    </Row>
                    <Row>
                        <h6 className="font-weight-bold">Expiration:</h6>
                        <h6>&nbsp;&nbsp;{extractDate(item.expiration)}</h6> {/*&nbsp; inserisce uno spazio*/}
                    </Row>
                </Col>
                <Col xs={3}>
                    <img src={parseFromType(item.type)} alt="type image"/>
                </Col>
            </Row>
        </Container>
    )
}

// TODO: importante, per eseguire fuori da docker con hot reload, usa:

// npm start --host 0.0.0.0 --port 3000 --disableHostCheck true
