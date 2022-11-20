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
import images from "../../Images/images";
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
    const [showNavCentred, setShowNavCentred] = useState(false);

    return (
        <MDBNavbar expand='lg' light bgColor='white'>
            <MDBContainer fluid>
                <MDBNavbarBrand tag="span" className='mb-0 h1' href='#'>
                    <img
                        src={images.zucchetta}
                        height='30'
                        alt=''
                        loading='lazy'
                    />
                    S.D.C.C Shopping List
                </MDBNavbarBrand>
                <MDBNavbarToggler
                    type='button'
                    data-target='#navbarCenteredExample'
                    aria-controls='navbarCenteredExample'
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                    onClick={() => setShowNavCentred(!showNavCentred)}
                >
                    <MDBIcon icon='bars' fas/>
                </MDBNavbarToggler>

                <MDBCollapse navbar show={showNavCentred} id='navbarCenteredExample'>
                    <MDBNavbarNav fullWidth={false} className='mb-2 mb-lg-0'>
                        <MDBNavbarItem className="center">
                            <MDBNavbarLink className={(url === "/" ? " active" : "")} aria-current='page' href='/'>Shopping List</MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem className="center">
                            <MDBNavbarLink className={(url === "/productStoragePage" ? " active" : "")} href='/productStoragePage'>Storage</MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem className="center">
                            <MDBNavbarLink className={(url === "/recipesPage" ? " active" : "")} href='/recipesPage'>Recipes</MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem className="center">
                            <MDBNavbarLink className={(url === "/statisticsPage" ? " active" : "")} href='/statisticsPage'>Statistics</MDBNavbarLink>
                        </MDBNavbarItem>
                    </MDBNavbarNav>
                </MDBCollapse>
            </MDBContainer>
        </MDBNavbar>
    );
};

export default Navbar;