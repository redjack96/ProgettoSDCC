import React from 'react'
import {Container} from "react-bootstrap";
import {Helmet} from 'react-helmet';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Storage} from "./Services/Storage";
import {Recipes} from "./Services/Recipes";
import Home from "./Services/Home";
import UpdateProductPage from "./Navigation/Shopping/UpdateProductPage";
import {UpdatePantryPage} from "./Navigation/Storage/UpdatePantryPage";
import {AddPantryPage} from "./Navigation/Storage/AddPantryPage";
import {Statistics} from "./Navigation/Statistics/Statistics";



export function App() {
    return (
        <Container>
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
                    <Route path="/statisticsPage" element={<Statistics />}/>
                    {/*For react-router < v6, use Redirect instead of Navigate AND it cannot be child of Routes! It must be used where needed (in a button onClick={() => navigate("/")}, where const navigate = useNavigate();)*/}
                    {/*<Navigate to={"/"}/>*/}
                </Routes>
            </BrowserRouter>
            <Helmet>
                <style>{'body { background-color: #ecebe4; }'}</style>
            </Helmet>
        </Container>
    );
}

// To run, use: npm start --host 0.0.0.0 --port 3000 --disableHostCheck true