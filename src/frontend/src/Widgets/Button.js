import React, {useEffect, useState} from "react";
import Button from 'react-bootstrap/Button';

function addToCart() {
    return new Promise((resolve) => setTimeout(resolve, 2000));
}

export function AddButton() {
    const [isLoading, setLoading] = useState(false);

    const styles = {
        button_up: {
            fontFamily: "-apple-system",
            fontSize: "1rem",
            fontWeight: 1.5,
            lineHeight: 1.5,
            color: "#292b2c",
            backgroundColor: "#fff",
            padding: "0 2em"
        },
    }

    useEffect(() => {
        if (isLoading) {
            addToCart().then(() => {
                setLoading(false);
            });
        }
    }, [isLoading])

    const handleClick = () => setLoading(true);

    return (
        <Button
            variant="primary"
            disabled={isLoading}
            onClick={!isLoading ? handleClick : null}
        > {isLoading ? 'Loading' : 'Click To Load'} </Button>
    );
}

function deleteFromList(name) {
    // return new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Questo è quello che voglio eliminare:"+name)
    return fetch('http://localhost:8007/removeProduct/'+name, {
        method: "POST"
    })
        .then(value => {
            let x = value.json();
            console.log("Elemento eliminato dalla shopping list.")
            return x;
        })
        .catch(reason => console.log("Errore: "+reason))
}

export function DeleteButton(props) {
    const [isDeleting, setDeleting] = useState(false);

    // no load, this will be called, needed to change isDeleting state
    useEffect(() => {
        if (isDeleting) {
            console.log("Rimuovo dalla grafica: " + props.item.product_name);
            setDeleting(false);
            // deleteFromList(item.product_name).then(() => {
            //     setDeleting(false);
            // });
        }
    }, [isDeleting, props.item])

    // this is the handler for the button
    const handleClick = e => {
        e.preventDefault();
        setDeleting(true);
        console.log("delete: " + e.target.value);
        console.log("delete: " + props.onClick);
        // qua chiama la onItemRemoval!!!
        props.onClick(e.target.value);
    }

    return (
        <Button
            value={props.item.product_name}
            variant="danger"
            disabled={isDeleting}
            onClick={!isDeleting ? handleClick : null}
        >   {isDeleting ? 'Deleting' : 'Delete'}
        </Button>
    );
}