import React from 'react'
import {Container} from "react-bootstrap";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./Navigation/Home";
import UpdateProductPage from "./Navigation/UpdateProductPage";

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
                    {/*For react-router < v6, use Redirect instead of Navigate AND it cannot be child of Routes! It must be used where needed (in a button?)*/}
                    {/*<Navigate to={"/"}/>*/}
                </Routes>
            </BrowserRouter>
        </Container>
    );
}

// TODO: importante, per eseguire fuori da docker con hot reload, usa:

// npm start --host 0.0.0.0 --port 3000 --disableHostCheck true
