import React from "react";
import {Container, Row} from "react-bootstrap";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage, MDBCardText, MDBCardTitle, MDBCol, MDBSpinner,
} from "mdb-react-ui-kit";
import Navbar from "../Navigation/Utils/Navbar";
import {PageHeader} from "../Navigation/Utils/PageHeader";
import {API_GATEWAY_ADDRESS} from "./Home";


export function Recipes() {
    const [loading, setLoading] = React.useState(false)
    const [voidMessage, setVoidMessage] = React.useState("No recipes available for your pantry!");
    const [items, setItems] = React.useState({
        recipes: []
    });

    // called on page load, loads the entire list from shopping_list microservice
    React.useEffect(() => {
        if (!loading) {
            console.log("reloading list from server");
            setLoading(true);
            fetch(API_GATEWAY_ADDRESS + '/getRecipes')
                .then(r => {
                    let x = r.json();
                    console.log(x);
                    return x;
                })
                .then(itemsOrError => {
                    try {
                        setItems(itemsOrError)
                        setVoidMessage("No recipes available for your pantry!")
                    } catch {
                        console.log("Error: shopping_list service is down")
                        setItems({
                            recipes: []
                        })
                        setVoidMessage(itemsOrError.msg)
                    }
                })
                .catch(e => console.log("Errore: " + e))
        }
    }, [items]);

    const showListIngredients = (ingredient, index, row) => {
        console.log(row.length)
        if (index == row.length-1) {
            return ingredient.name;
        } else {
            return ingredient.name+',';
        }
    }

    return(
        <Container>
            <Navbar/>
            <PageHeader pageName="Recipes"/>
            <Row xs={1} md={4} className="g-4 fixed scrollable">
                {items.recipes.length === 0 && (
                    // <p className="text-center">{voidMessage}</p>
                    <MDBSpinner className="center p-5" color='success'>
                        <span className='visually-hidden'>Loading...</span>
                    </MDBSpinner>
                )}
                {items.recipes.map(item => (
                    <MDBCol>
                        <MDBCard>
                            <MDBCardImage src={item.img} position='top' alt='...' />
                            <MDBCardBody>
                                <MDBCardTitle>{item.title}</MDBCardTitle>
                                <MDBCardText>
                                    Missing Ingredients:<br/>
                                    {item.missed_ingredients.slice(0,10).map((ingredient, index, row) => showListIngredients(ingredient, index, row))}
                                </MDBCardText>
                                <MDBBtn href={item.url} color="success">Prepare...</MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                ))}
            </Row>
        </Container>
    )
}