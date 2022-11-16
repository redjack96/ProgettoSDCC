import React from "react";
import {Container, Row} from "react-bootstrap";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCardImage, MDBCardText, MDBCardTitle,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBListGroup,
    MDBListGroupItem,
    MDBRipple,
    MDBRow,
    MDBTooltip,
    MDBTypography,
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

    return(
        <Container>
            <Navbar/>
            <PageHeader pageName="Recipes"/>
            <Row xs={1} md={4} className="g-4 fixed scrollable">
                {items.recipes.length === 0 && (
                    <p className="text-center">{voidMessage}</p>
                )}
                {items.recipes.map(item => (
                    <MDBCard>
                        <MDBCardImage src={item.img} position='top' alt='...' />
                        <MDBCardBody>
                            <MDBCardTitle>{item.title}</MDBCardTitle>
                            <MDBCardText>
                                Some quick example text to build on the card title and make up the bulk of the card's content.
                            </MDBCardText>
                            <MDBBtn href={item.url} color="success">Prepare...</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                ))}
            </Row>
        </Container>
    )
}