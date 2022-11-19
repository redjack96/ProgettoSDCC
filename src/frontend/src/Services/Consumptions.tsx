import React, {useState} from "react";
import {API_GATEWAY_ADDRESS, ProductType, Unit} from "./Home";

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
                    try {
                        setConsData(itemsOrError);
                        setVoidMessage("No consumption data available.");
                    } catch {
                        console.log("Error: consumption service is down")
                        setConsData({
                            predicted: []
                        });
                        setVoidMessage(itemsOrError.msg);
                    }
                })
                .catch(e => console.log("Errore: " + e))
        }
    }, [consData]);

    return(
        <div className="auto-max scrollable">
            <table className="table align-middle mb-0 bg-white">
                <thead className="bg-light">
                <tr>
                    <th>Product Name</th>
                    <th>Consumption (%)</th>
                </tr>
                </thead>
                <tbody>
                {/*map items nel pantry in pantry element come in shopping list*/}
                {consData.predicted.length === 0 && (
                    <p className="text-center">{voidMessage}</p>
                )}
                {consData.predicted.map(item => (
                    <PredictedEntry
                        entry={item}
                    />
                ))}
                </tbody>
            </table>
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