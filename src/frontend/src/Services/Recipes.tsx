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
    const [serviceAvailable, setServiceAvailable] = React.useState(true);
    const [items, setItems] = React.useState({
        recipes: [{
            img: "",
            title: "",
            missed_ingredients: [],
            url: ""
        }]
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
                    if (itemsOrError.hasOwnProperty('recipes')) {
                        // service up
                        setItems(itemsOrError);
                        setServiceAvailable(true);
                        setVoidMessage("No recipes available for your pantry!");
                    } else if (itemsOrError.hasOwnProperty('msg')) {
                        // service down
                        console.log("Error: recipes service is down")
                        setItems({
                            recipes: []
                        })
                        setServiceAvailable(false);
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

    const displayMessageOrSpinner = (items) => {
        if (serviceAvailable) {
            if (items.recipes.length == 1) {
                return(<MDBSpinner className="center p-5" color='success'>
                    <span className='visually-hidden'>Loading...</span>
                </MDBSpinner>);
            } else if (items.recipes.length == 0) {
                return (<p className="text-center">{voidMessage}</p>);
            }
        } else if (!serviceAvailable) {
            return (<p className="text-center">{voidMessage}</p>);
        }
    }

    const displayRecipes = (items) => {
        if (items.recipes.length != 1 || (items.recipes.length == 1 && items.recipes[0].title != "")) {
            return items.recipes.map(item => (
                <MDBCol>
                    <MDBCard>
                        <MDBCardImage src={item.img} position='top' alt='...'/>
                        <MDBCardBody>
                            <MDBCardTitle>{item.title}</MDBCardTitle>
                            <MDBCardText>
                                Missing Ingredients:<br/>
                                {item.missed_ingredients.slice(0, 10).map((ingredient, index, row) => showListIngredients(ingredient, index, row))}
                            </MDBCardText>
                            <MDBBtn href={item.url} color="success">Prepare...</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            ));
        }
    }

    return(
        <Container>
            <Navbar/>
            <PageHeader pageName="Recipes"/>
            <Row xs={1} md={4} className="g-4 fixed scrollable">
                {displayMessageOrSpinner(items)}
                {displayRecipes(items)}
            </Row>
        </Container>
    )
}