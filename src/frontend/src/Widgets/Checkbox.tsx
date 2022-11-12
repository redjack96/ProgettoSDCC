import React from "react";
import { useState } from "react";

const Checkbox = ({ label, onFunc , offFunc }) => {
    const [isChecked, setIsChecked] = useState(false)

    // const checkedDisplay = () => {
    //     if (isChecked) {
    //         onFunc();
    //         setIsChecked(false);
    //         return "on";
    //     }
    //     if (!isChecked) {
    //         offFunc();
    //         setIsChecked(null);
    //         return "off"
    //     }
    // }

    const checkedDisplay = () => {
        return isChecked ? "on":"off"
    }

    return (
        <div className="checkbox-wrapper">
            <label>
                <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(prevState => !prevState)}/>
                <span>{label}</span>
            </label>
            <p>{checkedDisplay()}</p>
        </div>
    );
};
export default Checkbox;