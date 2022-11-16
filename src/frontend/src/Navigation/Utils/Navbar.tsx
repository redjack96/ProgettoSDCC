import React from "react";
import {useNavigate} from "react-router-dom";
// import {Storage} from "../Services/Storage"


const Navbar = () => {
    const navigate = useNavigate()

    const toStoragePage = () => {
        navigate("/productStoragePage", {
            state: {}
        })
    }

    const toShoppingPage = () => {
        navigate("/", {
            state: {}
        })
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">
                S.D.C.C ShoppingList
            </a>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav">
                    <li className="nav-item active">
                        <a className="nav-link" href="/">
                            Shopping List <span className="sr-only">(current)</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/productStoragePage">
                            Storage
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/recipesPage">
                            Recipes
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/consumptionsPage">
                            Consumption
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/summaryPage">
                            Summary
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;