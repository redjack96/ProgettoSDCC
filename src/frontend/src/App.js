import {Container, Button, Row, Col, Form, InputGroup, Alert} from 'react-bootstrap';
import React from 'react'
import './App.css';
import Navbar from './Navigation/Navbar.js';
import {AddButton, DeleteButton} from "./Widgets/Button";

export function App() {
    console.log("Prova hot reload 13");
    return (
        <div>
            <div>
                <Navbar/>
            </div>
            <Row>
                <Col md={{offset: 3, span: 6}}>
                    <ShoppingListCard/>
                </Col>
            </Row>
        </div>
    );
}

function Item(props) {
    return (
        <div className="col center">
            <div className="card">
                {/*<img src="../res/images/Avenue-of-the-Baobobs-Madagascar 2.png" className="card-img-top" alt="product-image"/>*/}
                    <div className="card-body">
                        <h4 id="title" className="card-title">{props.item_name}</h4>
                        {/*<div className="price-tag" style="position: absolute; right: 0px;">*/}
                        {/*    <h5>${price}&euro;</h5>*/}
                        {/*</div>*/}
                        <div className="locations">
                            <h6>Quantity: {props.quantity}</h6>
                        </div>
                        <div className="categories">
                            <h6>Type: {props.type}</h6>
                        </div>
                        {/*<button type="submit" name="viewinfo" className="btn btn-primary" value="${btninfoid}">More Info...</button>*/}
                        <AddButton />
                        <DeleteButton name={props.item_name} onClick={props.onItemRemoval}/>
                    </div>
            </div>
        </div>
    );
}

function ShoppingListCard() {
    const [items, setItems]= React.useState({
        id: 0,
        name: "",
        products: []
    });

    const onItemRemoval = React.useCallback(
        item => {
            console.log("so qua")
            console.log(item)
            const i = items.products.findIndex(value => value.product_name === item)
            // const index = items.findIndex(i => i.id === item.id);
            setItems({
                id: 0,
                name: "",
                products: [...items.products.slice(0, i), ...items.products.slice(i + 1)]
            });
        },
        [items],
    );

    const onNewItem = React.useCallback(
        newItem => {
            setItems([...items, newItem]);
        },
        [items],
    );

    const onItemUpdate = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([
                ...items.slice(0, index),
                item,
                ...items.slice(index + 1),
            ]);
        },
        [items],
    );

    React.useEffect(() => {
        fetch('http://localhost:8007/getList')
            .then(r => {
                let x = r.json();
                console.log(x);
                console.log("ye, che bello!!!!");
                return x;
            })
            .then(setItems)
            .catch(e => console.log("Errore: " + e))
    }, []);

    const rows = [];

    for (let i=0; i< items.products.length; i++){
        let product = items.products[i];
        rows.push(
            <Item key={i} item_name={product.product_name} quantity={product.quantity} type={product.type} onItemUpdate={onItemUpdate} onItemRemoval={onItemRemoval}/>,
        )
    }

    return (
        <div>
            {/*<AddItemForm onNewItem={onNewItem} />*/}
            {/*{rows.length === 0 && (*/}
            {/*    <p className="text-center">Nessun prodotto! Aggiungine uno quando vuoi.</p>*/}
            {/*)}*/}
            {rows}
        </div>
    );
}

// function AddItemForm({ onNewItem }) {
//     const [newItem, setNewItem] = React.useState('');
//     const [submitting, setSubmitting] = React.useState(false);
//
//     const submitNewItem = e => {
//         e.preventDefault();
//         setSubmitting(true);
//         fetch('http://localhost:8007/', {
//             method: 'POST',
//             body: JSON.stringify({ name: newItem }),
//             headers: { 'Content-Type': 'application/json' },
//         })
//             .then(r => r.json())
//             .then(item => {
//                 onNewItem(item);
//                 setSubmitting(false);
//                 setNewItem('');
//             });
//     };
//
//     return (
//         <Form onSubmit={submitNewItem}>
//             <InputGroup className="mb-3">
//                 <Form.Control
//                     value={newItem}
//                     onChange={e => setNewItem(e.target.value)}
//                     type="text"
//                     placeholder="Nuovo Oggetto"
//                     aria-describedby="basic-addon1"
//                 />
//                 <InputGroup.Append>
//                     <Button
//                         type="submit"
//                         variant="success"
//                         disabled={!newItem.length}
//                         className={submitting ? 'disabled' : ''}
//                     >
//                         {submitting ? 'Adding...' : 'Aggiungi.'}
//                     </Button>
//                 </InputGroup.Append>
//             </InputGroup>
//         </Form>
//     );
// }
