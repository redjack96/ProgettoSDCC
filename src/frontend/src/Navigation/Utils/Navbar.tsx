import React, {useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
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
    const navigate = useNavigate(); // once ready it returns the 'window.location' object
    const location = useLocation();
    const [url, setUrl] = useState(null);
    React.useEffect(() => {
        setUrl(location.pathname);
    }, [location]);
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
        <MDBNavbar expand='lg' light bgColor='white'>
            <MDBContainer fluid>
                <MDBNavbarBrand tag="span" className='mb-0 h1' href='#'>S.D.C.C Shopping List</MDBNavbarBrand>

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
                            <MDBNavbarLink className={(url === "/" ?" active" : "")} aria-current='page' href='/'>Shopping List</MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink className={(url === "/productStoragePage" ?" active" : "")} href='/productStoragePage'>Storage</MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink className={(url === "/recipesPage" ?" active" : "")} href='/recipesPage'>Recipes</MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink className={(url === "/statisticsPage" ?" active" : "")} href='/statisticsPage'>Statistics</MDBNavbarLink>
                        </MDBNavbarItem>
                    </MDBNavbarNav>
                </MDBCollapse>
                <MDBBtn color='success'>Coming soon...</MDBBtn>
            </MDBContainer>
        </MDBNavbar>
    );
};

export default Navbar;