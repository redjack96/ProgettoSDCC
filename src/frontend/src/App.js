import {Container, Button, Row, Col, Form, InputGroup, Alert} from 'react-bootstrap';
import React from 'react'
import './App.css';
import Navbar from './Navigation/Navbar.js';
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
            console.log("index = " + i);
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
            setItems([
                ...items.products.slice(0, index),
                item,
                ...items.products.slice(index + 1),
            ]);
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

        fetch('http://localhost:8007/addProduct/' + newItem + '/' + quantity + '/' + unit + '/' + type + '/' + expiration, {method: 'POST'})
            .then(r => r.json)
            .then(() => {
                // we call the callback passed as a parameter (!) to this component. We give it the item name to add. For us, it will be an object
                onNewItem(newItem);
                console.log("added " + newItem);
                // we are done submitting the item
                setSubmitting(false);
                // we update the state of "newItem" to an empty string, to clean the text field.
                setNewItem('');
            })
    }

    // We return a Form with an input group that is a Control (textfield) plus a Button.
    // TODO: We will need to add also the quantity, type and expiration fields.
    return (
        <Form onSubmit={submitNewItem}>
            <InputGroup className="mb-3">{/* TODO: a cosa serve? */}
                {/*This is needed to write the name of the product*/}
                <Form.Control
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    type="text"
                    placeholder="New Item"
                    aria-describedby="basic-addon1"
                />
                <Button
                    type="submit"
                    variant="success"
                    disabled={!newItem.length}
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
        fetch(`localhost:8007/addToCart/${item.product_name}/${item.unit}/${item.type}`, {method: 'POST'})
            .then(r => r.json())
            // here it will receive the json object given in input?
            .then(() => onItemUpdate(item)) // FIXME: qua ho modificato rispetto a then(onItemUpdate) perché la risposta che riceviamo dall'API non e' un oggetto, ma un messaggio
    }
    // called when clicking the removeFromCart button
    const removeFromCart = () => {
        // Watch out! Here we use the ` NOT ' !!!
        fetch(`localhost:8007/removeFromCart/${item.product_name}/${item.unit}/${item.type}`, {method: 'POST'})
            .then(r => r.json())
            // here it will receive the json object given in input?
            .then(() => onItemUpdate(item)) // TODO: forse bisogna farsi restituire l'item da rust e non un messaggio per dire ok fatto!
        // FIXME: qua ho modificato rispetto a then(onItemUpdate) perché la risposta che riceviamo dall'API non e' un oggetto, ma un messaggio
    }

    // called when removing an item
    const removeItem = () => {
        // TODO: qua andrebbe aggiunto anche unit e type.
        let x = `localhost:8007/removeProduct/${item.product_name}`;
        console.log(x);
        fetch(x, {method: 'POST'})
            .then(() => onItemRemoval(item));
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
                    <Col xs={1} className="text-center remove">
                        <Button
                            size="sm"
                            variant="danger"
                            onClick={removeItem}
                            aria-label="Rimuovi il prodotto"
                        >
                            Rimuovi
                        </Button>
                    </Col>
                </div>
            </div>
        </div>
        /* <Container fluid className={`item ${item.added_to_cart && 'completed'}`}>
             <Row>
                 {/!*TODO: This is used for the [v] on added or removed from cart. Should be deleted*!/}
                 <Col xs={1} className="text-center">
                     <Button
                         className="toggles"
                         size="sm"
                         variant="link"
                         onClick={addToCart}
                         aria-label={
                             item.added_to_cart
                                 ? 'Mark item as incomplete'
                                 : 'Mark item as complete'
                         }
                     >
                         <i
                             className={`far ${
                                 item.added_to_cart ? 'fa-check-square' : 'fa-square'
                             }`}
                         />
                     </Button>
                 </Col>
                 <Col xs={10} className="name">
                     {item.product_name}
                 </Col>
                 <Col xs={1} className="text-center remove">
                     <Button
                         size="sm"
                         variant="link"
                         onClick={removeItem}
                         aria-label="Remove Item"
                     >
                         <i className="fa fa-trash text-danger" />
                     </Button>
                 </Col>
             </Row>
         </Container>*/
    );
}

function ItemInfo({item}) {
    return (
        <Container>
            <h4 className="card-title">{item.product_name}</h4>
            <div className="locations">
                <h6>Quantity: {item.quantity}</h6>
            </div>
            <div className="categories">
                <h6>Type: {item.type}</h6>
            </div>
        </Container>
    )
}

// TODO: importante, per eseguire fuori da docker con hot reload, usa:

// npm start --host 0.0.0.0 --port 3000 --disableHostCheck true
