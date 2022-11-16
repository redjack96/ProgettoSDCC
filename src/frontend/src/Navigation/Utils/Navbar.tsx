import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    MDBBtn,
    MDBCollapse,
    MDBContainer,
    MDBIcon,
    MDBNavbar,
    MDBNavbarBrand, MDBNavbarItem, MDBNavbarLink,
    MDBNavbarNav,
    MDBNavbarToggler, MDBRow
} from "mdb-react-ui-kit";
import {Col, Row} from "react-bootstrap";
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
    const [showBasic, setShowBasic] = useState(false);

    return (
        // <nav className="navbar navbar-expand-lg navbar-light bg-light">
        //     <a className="navbar-brand" href="#">
        //         S.D.C.C ShoppingList
        //     </a>
        //     <button
        //         className="navbar-toggler"
        //         type="button"
        //         data-toggle="collapse"
        //         data-target="#navbarNavDropdown"
        //         aria-controls="navbarNavDropdown"
        //         aria-expanded="false"
        //         aria-label="Toggle navigation"
        //     >
        //         <span className="navbar-toggler-icon"></span>
        //     </button>
        //
        //     <div className="collapse navbar-collapse" id="navbarNavDropdown">
        //         <ul className="navbar-nav">
        //             <li className="nav-item active">
        //                 <a className="nav-link" href="/">
        //                     Shopping List <span className="sr-only">(current)</span>
        //                 </a>
        //             </li>
        //             <li className="nav-item">
        //                 <a className="nav-link" href="/productStoragePage">
        //                     Storage
        //                 </a>
        //             </li>
        //             <li className="nav-item">
        //                 <a className="nav-link" href="/recipesPage">
        //                     Recipes
        //                 </a>
        //             </li>
        //             <li className="nav-item">
        //                 <a className="nav-link" href="/consumptionsPage">
        //                     Consumption
        //                 </a>
        //             </li>
        //             <li className="nav-item">
        //                 <a className="nav-link" href="/summaryPage">
        //                     Summary
        //                 </a>
        //             </li>
        //         </ul>
        //     </div>
        // </nav>
        <MDBNavbar expand='lg' light bgColor='light'>
            <MDBContainer fluid>
                <MDBNavbarBrand href='#'>S.D.C.C-S</MDBNavbarBrand>

                <MDBNavbarToggler
                    aria-controls='navbarSupportedContent'
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                    onClick={() => setShowBasic(!showBasic)}
                >
                    <MDBIcon icon='bars' fas />
                </MDBNavbarToggler>

                <MDBCollapse navbar show={showBasic}>
                    <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
                        <MDBNavbarItem>
                            <MDBNavbarLink active aria-current='page' href='/'>
                                Shopping List
                            </MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink href='/productStoragePage'>Storage</MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink href='/recipesPage'>Recipes</MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink href='/summaryPage'>Summary</MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink href='/consumptionsPage'>Consumption</MDBNavbarLink>
                        </MDBNavbarItem>
                    </MDBNavbarNav>
                </MDBCollapse>
                <MDBBtn color='success'>Coming soon...</MDBBtn>
            </MDBContainer>
        </MDBNavbar>
    );
};

export default Navbar;