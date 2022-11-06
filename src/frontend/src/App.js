import {Container, Row, Col, Form, InputGroup, Button} from 'react-bootstrap';
import React from 'react'
import './App.css';

export function App() {
    console.log("Prova hot reload 10");
    return (
        <Container>
            <Row>
                <Col md={{offset: 3, span: 6}}>
                    <ShoppingListCard/>
                </Col>
            </Row>
        </Container>
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
        rows.push(<Item key={i} item_name={product.product_name} quantity={product.quantity} type={product.type}/>)
    }

    return (
        <div>
            {rows}
        </div>
    );
}
