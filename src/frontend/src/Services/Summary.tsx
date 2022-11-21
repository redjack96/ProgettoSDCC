import React, {useState} from "react";
import {Col, Container, Dropdown, Row} from "react-bootstrap";
import {API_GATEWAY_ADDRESS} from "./Home";

import {
    MDBCol,
    MDBIcon,
    MDBRow,
    MDBTabs,
    MDBTabsContent,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsPane
} from "mdb-react-ui-kit";
export function Summary() {
    const [loading, setLoading] = useState(true);
    const [dropValue, setDropValue] = useState("Weekly");
    const [verticalActive, setVerticalActive] = useState('tab1');
    const [voidMessage, setVoidMessage] = useState("");
    const [summaryData, setSummaryData] = useState({
        reference: 0,
        most_used_product: "".toString(),
        most_bought_product: "".toString(),
        times_used: 0,
        times_bought: 0,
        number_expired: 0,
    });

    const handleVerticalClick = (value: string) => {
        if (value === verticalActive) {
            return;
        }

        setVerticalActive(value);
    };


    const onWeekly = () => {
        console.log("on weekly");
        setDropValue("Weekly");
        fetch(API_GATEWAY_ADDRESS + '/getWeekSummary')
            .then(r => {
                let x = r.json();
                console.log(x);
                return x;
            })
            .then(itemsOrError => {
                if (itemsOrError.hasOwnProperty('msg')) {
                    // service down
                    console.log("Error: summary service is down.");
                    setVoidMessage(itemsOrError.msg);
                    setSummaryData({
                        reference: 0,
                        most_used_product: "".toString(),
                        most_bought_product: "".toString(),
                        times_used: 0,
                        times_bought: 0,
                        number_expired: 0,
                    });
                } else {
                    setSummaryData(itemsOrError);
                    setVoidMessage("");
                }
            })
            .catch(e => console.log("Errore: " + e));
    }

    const onMonthly = () => {
        console.log("on monthly");
        setDropValue("Monthly");
        fetch(API_GATEWAY_ADDRESS + '/getMonthSummary')
            .then(r => {
                let x = r.json();
                console.log(x);
                return x;
            })
            .then(itemsOrError => {
                if (itemsOrError.hasOwnProperty('msg')) {
                    // service down
                    console.log("Error: summary service is down.");
                    setVoidMessage(itemsOrError.msg);
                    setSummaryData({
                        reference: 0,
                        most_used_product: "".toString(),
                        most_bought_product: "".toString(),
                        times_used: 0,
                        times_bought: 0,
                        number_expired: 0,
                    });
                } else {
                    setSummaryData(itemsOrError);
                    setVoidMessage("");
                }
            })
            .catch(e => console.log("Errore: " + e));
    }

    const onTotal = () => {
        console.log("on total");
        setDropValue("Total");
        fetch(API_GATEWAY_ADDRESS + '/getTotalSummary')
            .then(r => {
                let x = r.json();
                console.log(x);
                return x;
            })
            .then(itemsOrError => {
                if (itemsOrError.hasOwnProperty('msg')) {
                    // service down
                    console.log("Error: summary service is down.");
                    setVoidMessage(itemsOrError.msg);
                    setSummaryData({
                        reference: 0,
                        most_used_product: "".toString(),
                        most_bought_product: "".toString(),
                        times_used: 0,
                        times_bought: 0,
                        number_expired: 0,
                    });
                } else {
                    setSummaryData(itemsOrError);
                    setVoidMessage("");
                }
            })
            .catch(e => console.log("Errore: " + e));
    }

    React.useEffect(() => {
        if (loading){
            setLoading(false);
            onWeekly();
        }
    }, [dropValue, verticalActive, voidMessage, summaryData]);


    return (
        <React.Fragment>
            <Row>
                {voidMessage === "" && (
                    <MDBRow className="mt-3">
                        <MDBCol className="border-right">
                            <h6>Time period selected: </h6>
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    {dropValue}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => onWeekly()}>Weekly</Dropdown.Item>
                                    <Dropdown.Item onClick={() => onMonthly()}>Monthly</Dropdown.Item>
                                    <Dropdown.Item onClick={() => onTotal()}>Total</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <MDBTabs pills className='flex-column text-center mt-3'>
                                <MDBTabsItem>
                                    <MDBTabsLink onClick={() => handleVerticalClick('tab1')} active={verticalActive === 'tab1'}>
                                        <MDBIcon fas icon='chart-line' className='me-2'/> Trends
                                    </MDBTabsLink>
                                </MDBTabsItem>
                                <MDBTabsItem>
                                    <MDBTabsLink onClick={() => handleVerticalClick('tab2')} active={verticalActive === 'tab2'}>
                                        <MDBIcon fas icon='chart-pie' className='me-2'/> Stats
                                    </MDBTabsLink>
                                </MDBTabsItem>
                                <MDBTabsItem>
                                    <MDBTabsLink onClick={() => handleVerticalClick('tab3')} active={verticalActive === 'tab3'}>
                                        <MDBIcon fas icon='exclamation-circle' className='me-2'/> Warn
                                    </MDBTabsLink>
                                </MDBTabsItem>
                            </MDBTabs>
                        </MDBCol>
                        <MDBCol>
                            <MDBTabsContent>
                                <MDBTabsPane show={verticalActive === 'tab1'}>
                                    <p>Most bought: {summaryData.most_bought_product}</p>
                                    <p>Most used: {summaryData.most_used_product}</p>
                                </MDBTabsPane>
                                <MDBTabsPane show={verticalActive === 'tab2'}>
                                    <p>Times you bought a product: {summaryData.times_bought}</p>
                                    <p>Times you used a product: {summaryData.times_used}</p>
                                </MDBTabsPane>
                                <MDBTabsPane show={verticalActive === 'tab3'}>
                                    <p>There are {summaryData.number_expired} expired products in your pantry!</p>
                                </MDBTabsPane>
                            </MDBTabsContent>
                        </MDBCol>
                    </MDBRow>
                )}
            </Row>
            <Row>
                {voidMessage !== "" && (
                    <p>{voidMessage}</p>
                )}
            </Row>
        </React.Fragment>
    )
}

