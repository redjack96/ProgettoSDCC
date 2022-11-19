import React, {useState} from "react";
import {PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer} from "recharts";
import { MDBRow } from "mdb-react-ui-kit";

export function CustomPieChart({data}) {
    const COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042", "#AF19FF"];
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

    return (
        <MDBRow>
            <ResponsiveContainer height={300} width="100%">
                <PieChart width={730} height={300}>
                    <Pie
                        data={data}
                        color="#000000"
                        dataKey="consumption"
                        nameKey="product"
                        // cx="50%"
                        // cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                    >
                        {data.map((entry, index) => (
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
    );
}