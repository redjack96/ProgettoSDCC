import React, {useState} from "react";
import {PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer} from "recharts";
import { MDBRow } from "mdb-react-ui-kit";
import {API_GATEWAY_ADDRESS} from "./Home";

export function Consumptions() {
    const COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042", "#AF19FF"];
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

    const customTooltip = ({ active, payload}) => {
        if (active) {
            return (
                <div
                    className="custom-tooltip"
                    style={{
                        backgroundColor: "#ffff",
                        // padding: "5px",
                        // border: "1px solid #cccc"
                    }}
                >
                    <label>{`${payload[0].name} : ${payload[0].value*100}%`}</label>
                </div>
            );
        }
        return null;
    }

    return(
        <MDBRow>
            <ResponsiveContainer height={300} width="100%">
                <PieChart width={730} height={300}>
                    <Pie
                        data={consData.predicted}
                        color="#000000"
                        dataKey="consumption"
                        nameKey="product"
                        // cx="50%"
                        // cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                    >
                        {consData.predicted.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={customTooltip} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </MDBRow>
    )
}