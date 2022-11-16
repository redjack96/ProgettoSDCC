import React from 'react'
import {Container} from "react-bootstrap";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./Navigation/Home";
import UpdateProductPage from "./Navigation/UpdateProductPage";
import {Storage} from "./Services/Storage";
import {Recipes} from "./Services/Recipes";
import {Summary} from "./Services/Summary";
import {Consumptions} from "./Services/Consumptions";
import {UpdatePantryPage} from "./Navigation/UpdatePantryPage";
import {AddPantryPage} from "./Navigation/AddPantryPage";



export function App() {
    return (
        <React.Fragment>
            {/*When the apps first start, you will be redirected to /, so the Home page will be rendered. If you add /updateProductPage to the URL, you will see the other page!*/}
            <BrowserRouter>
                {/*For react-router < v6, use Switch instead of Routes*/}
                <Routes>
                    {/*For react-router < v6, use <Route exact path="/" component={Home} /> */}
                    <Route path="/" element={<Home/>}/>
                    <Route path="/updateProductPage" element={<UpdateProductPage/>}/>
                    <Route path="/productStoragePage" element={<Storage />}/>
                    <Route path="/updatePantryPage" element={<UpdatePantryPage />}/>
                    <Route path="/addPantryPage" element={<AddPantryPage />}/>
                    <Route path="/recipesPage" element={<Recipes />}/>
                    <Route path="/summaryPage" element={<Summary />}/>
                    <Route path="/consumptionsPage" element={<Consumptions />}/>
                    {/*For react-router < v6, use Redirect instead of Navigate AND it cannot be child of Routes! It must be used where needed (in a button onClick={() => navigate("/")}, where const navigate = useNavigate();)*/}
                    {/*<Navigate to={"/"}/>*/}
                </Routes>
            </BrowserRouter>
        </React.Fragment>
    );
}

// TODO: importante, per eseguire fuori da docker con hot reload, usa:
//  npm start --host 0.0.0.0 --port 3000 --disableHostCheck true
