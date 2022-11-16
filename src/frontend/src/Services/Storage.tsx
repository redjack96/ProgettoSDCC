import React from "react";
import {Button, ButtonGroup, Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import Navbar from "../Navigation/Navbar";
import {API_GATEWAY_ADDRESS, Item, ProductType, Timestamp, Unit} from "../Navigation/Home";
import {PageHeader} from "../Navigation/PageHeader";
import {useNavigate} from "react-router-dom";
import {green} from "@mui/material/colors";


export function Storage(){
    const [loading, setLoading] = React.useState(false)
    const [items, setItems] = React.useState({
        id: 0,
        name: "",
        products: []
    });
    const [voidMessage, setVoidMessage] = React.useState("No products in storage.");

    // called on page load, loads the entire list from storage microservice
    React.useEffect(() => {
        if (!loading) {
            console.log("reloading list from server");
            setLoading(true);
            fetch(API_GATEWAY_ADDRESS + '/getPantry')
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

    // this only sets the new state. To show the new Item, a new ItemDisplay component must be added
    const handleUseItems = React.useCallback(
        (usedItem: PantryItem) => {
            const newState = items.products.map(obj => {
                // if id is corresponding, update quantity property
                if (obj.product_name === usedItem.product_name && obj.type === usedItem.type && obj.unit === usedItem.unit) {
                    return {...obj, quantity: obj.quantity-usedItem.quantity};
                }

                // otherwise return object as is
                return obj;
            });
            if (loading) {
                try {
                    setItems({
                        ...items,
                        products: [newState]
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

    // This removes only from the array state "items.products"
    const onItemRemoval = React.useCallback(
        item => {
            console.log("DENTRO ITEM REMOVAL");
            const i = items.products.findIndex(value => value.item_name === item.item_name);
            console.log("index to remove = " + i);
            setItems({
                ...items,
                products: [...items.products.slice(0, i), ...items.products.slice(i + 1)]
            });
            setLoading(false);
        },
        [items.products],
    );


    /* Navigation functions */
    const navigate = useNavigate();

    const toAddPantryPage = () => {
        console.log("items: "+items)
        navigate('/addPantryPage', {
            state: {
                items: {items}
            }
        });
    }

    return (
      <Container>
          <Navbar/>
          <PageHeader pageName="My storage"/>
          <Row>
              <Col>
                  <Row>
                      <h2>Use item</h2>
                      <UseForm onUseItem={handleUseItems}/>
                  </Row>
                  <Row>
                      <h2>Other actions</h2>
                      <ButtonGroup as={Col}>
                          <Button
                              size="sm"
                              variant="success"
                              onClick={() => toAddPantryPage()}
                              aria-label="Add in pantry"
                          >
                              Add item
                          </Button>
                      </ButtonGroup>
                  </Row>
              </Col>
              <Col>
                  <h2>Pantry</h2>
                  <PantryView items={items} voidMessage={voidMessage} handleRemove={onItemRemoval}/>
              </Col>
          </Row>
      </Container>
    );
}

export class PantryItem {
    constructor(itemName: string, quantity: number, type: ProductType, unit: Unit, lastUsed: Timestamp,
                useNumber: number, totalUseNumber: number, timesBought: number, buyDate: Timestamp) {
        this.product_name = itemName;
        this.quantity = quantity;
        this.unit = unit;
        this.type = type;
        this.lastUsed = lastUsed;
        this.useNumber = useNumber;
        this.totalUseNumber = totalUseNumber;
        this.timesBought = timesBought;
        this.buyDate = buyDate;
    }

    product_name: string;
    quantity: number;
    type: ProductType;
    unit: Unit;
    lastUsed: Timestamp;
    useNumber: number;
    totalUseNumber: number;
    timesBought: number;
    buyDate: Timestamp;

    static default(): PantryItem {
        return new PantryItem("Unknown", 0, ProductType.Other, Unit.Packet, Timestamp.default(),
            0, 0, 0, Timestamp.default());
    }

    toString() {
        return `Item product_name: (${this.product_name} quantity: ${this.quantity} unit: ${this.unit} type: ${this.type})`
    }
}


export function UseForm({onUseItem}) {
    /* Form fields */
    const [itemName, setItemName] = React.useState('');
    const [quantity, setQuantity] = React.useState(0)
    const [type, setType] = React.useState(ProductType.Other);
    const [unit, setUnit] = React.useState(Unit.Packet);
    const [submitting, setSubmitting] = React.useState(false);

    const submitUseItem = e => {
        setSubmitting(true)
        e.preventDefault();
        // when this function is called, we submit a new item, so we setSubmitting to true
        setSubmitting(true);
        let request = API_GATEWAY_ADDRESS + '/useProductInPantry/' + itemName.trim() + '/' + quantity + '/' + Unit.toString(unit) + '/' + ProductType.toString(type);
        fetch(request, {method: 'POST'})
            .then(r => r.json)
            .then(() => {
                // we call the callback passed as a parameter (!) to this component. We give it the item name to add. For us, it will be an object
                onUseItem(new PantryItem(itemName, quantity, type, unit, new Timestamp(new Date().getTime(), 0),
                    1, 1, 1, new Timestamp(new Date().getTime(), 0)))
                console.log("used " + itemName.trim());
                // we are done submitting the item
                setSubmitting(false);
                // we update the state of "newItem" to an empty string, to clean the text field.
                setItemName('');
            })
    }

    return(
        <Form onSubmit={submitUseItem}>
            <InputGroup className="mb-3">
                {/*This is needed to write the name of the product*/}
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            value={itemName.trim()}
                            onChange={e => setItemName(e.target.value)}
                            type="text"
                            placeholder="New Item"
                            aria-describedby="basic-addon1"
                        />
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formQuantity">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                            value={quantity.valueOf()}
                            onChange={e => setQuantity(isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value))}
                            type="number"
                            placeholder="0"
                            aria-describedby="basic-addon1"
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formSelectUnit">
                        <Form.Label>Unit</Form.Label>
                        <Form.Control as="select" onChange={e => setUnit(Unit.parse(e.target.value))}>
                            <option>Select unit...</option>
                            <option>Bottle</option>
                            <option>Packet</option>
                            <option>Kg</option>
                            <option>Grams</option>
                        </Form.Control>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} controlId="formSelectType">
                        <Form.Label>Type</Form.Label>
                        {/*Il value è della select*/}
                        <Form.Control as="select" onChange={e => setType(ProductType.parse(e.target.value))}>
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
                <Button style={{'margin': '20px'}}
                    type="submit"
                    variant="success"
                    disabled={!itemName.trim().length}
                    className={submitting ? 'disabled' : ''}
                >
                    {submitting ? 'Using item...' : 'Use Item'}
                </Button>
            </InputGroup>
        </Form>
    )
}


export function PantryView({items, voidMessage, handleRemove}) {
    return(
        <table className="table align-middle mb-0 bg-white">
            <thead className="bg-light">
            <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
                {/*map items nel pantry in pantry element come in shopping list*/}
                {items.products.length === 0 && (
                    <p className="text-center">{voidMessage}</p>
                )}
                {items.products.map(item => (
                    <PantryElement
                        item={item}
                        onItemRemoval={handleRemove}
                        key={items.products.indexOf(item)}
                    />
                ))}
            </tbody>
        </table>
    )
}


export function PantryElement({item, onItemRemoval}) {
    // called when removing an item
    const removePantryItem = () => {
        fetch(API_GATEWAY_ADDRESS + `/dropProductFromStorage/${item.item_name}`, {method: 'POST'})
            .then(r => {
                console.log(r.json());
                return r;
            })
            .then(() => onItemRemoval(item))
            .catch((err) => console.log(err));
    };

    const navigate = useNavigate();

    const toUpdatePantryPage = () => {
        navigate('/updatePantryPage', {
            state: {
                item: item
            }
        });
    }

    return(
        <tr>
            <td>
                <div className="d-flex align-items-center">
                    <img
                        src={ProductType.imageFromType(item.type)}
                        alt=""
                        className="rounded-circle"
                        style={{ 'width': '45px', 'height': '45px' }}
                    />
                    <div className="ms-3">
                        <p className="fw-bold mb-1">{item.item_name}</p>
                        <p className="text-muted mb-0">{ProductType.parseFromInt(item.type)}</p>
                    </div>
                </div>
            </td>
            <td>
                <p className="fw-normal mb-1">{item.quantity}</p>
                <p className="text-muted mb-0">{Unit.parseFromInt(item.unit)}</p>
            </td>
            <td>
                <span className="badge badge-success rounded-pill d-inline">Active</span>
            </td>
            <td>
                <ButtonGroup>
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={removePantryItem}
                        aria-label="Rimuovi il prodotto"
                    >
                        Remove
                    </Button>
                    <Button
                        size="sm"
                        variant="success"
                        onClick={() => toUpdatePantryPage()}
                        aria-label="Update product in pantry"
                    >
                        Update
                    </Button>
                </ButtonGroup>
            </td>
        </tr>
    )
}