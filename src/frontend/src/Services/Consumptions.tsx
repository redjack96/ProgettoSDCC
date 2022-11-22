import React, {useState} from "react";
import { Row } from "react-bootstrap";
import {API_GATEWAY_ADDRESS} from "./Home";

// this component defines the Consumption table
export function Consumptions() {
    const [loading, setLoading] = React.useState(false)
    const [voidMessage, setVoidMessage] = React.useState("No consumption data available.");
    const [consData, setConsData] = useState({
        predicted: []
    })
    // called on page load, loads the entire list from shopping_list microservice
    React.useEffect(() => {
        if (!loading) {
            console.log("reloading list from server");
            setLoading(true);
            fetch(API_GATEWAY_ADDRESS + '/predictConsumptions')
                .then(r => {
                    let x = r.json();
                    console.log(x);
                    return x;
                })
                .then(itemsOrError => {
                    if (itemsOrError.hasOwnProperty('predicted')) {
                        // service up
                        setConsData(itemsOrError);
                        setVoidMessage("No consumption data available.");
                    } else if (itemsOrError.hasOwnProperty('msg')) {
                        // service down
                        console.log("Error: consumption service is down")
                        setConsData({
                            predicted: []
                        });
                        setVoidMessage(itemsOrError.msg);
                    }
                })
                .catch(e => console.log("Errore: " + e))
        }
    }, [consData, loading]);

    return(
        <div className="auto-max scrollable">
            {consData.predicted.length > 0 && (
                <table className="table align-middle mb-0 bg-white">
                    <thead className="bg-light">
                    <tr>
                        <th>Product Name</th>
                        <th>Consumption (%)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/*map items nel pantry in pantry element come in shopping list*/}
                    {consData.predicted.map(item => (
                        <PredictedEntry
                            entry={item}
                        />
                    ))}
                    </tbody>
                </table>
            )}
            {consData.predicted.length === 0 && (
                <Row>
                    <p className="text-center">{voidMessage}</p>
                </Row>
            )}
        </div>
    )
}


export function PredictedEntry({entry}) {
    return (
        <tr>
            <td>
                <p className="fw-bold mb-1">{entry.product}</p>
            </td>
            <td>
                <p className="fw-normal mb-1">{entry.consumption}</p>
            </td>
        </tr>
    );
}