import React from "react";

export function StatusAvailabilityBadge({itemQuantity}) {

    const createBadgeQuantity = (itemQuantity) => {
        if (itemQuantity == 0) {
            return(<span className="badge badge-danger rounded-pill d-inline">Finished</span>);
        } else {
            return(<span className="badge badge-success rounded-pill d-inline">Available</span>);
        }
    }
    return(createBadgeQuantity(itemQuantity));
}

function getTimestampInSeconds () {
    return Math.floor(Date.now() / 1000)
}

export function StatusExpirationBadge({itemExpiration}) {
    const createBadgeExpiration = (itemExpiration) => {
        let today = getTimestampInSeconds();
        console.log("item expiration: ", itemExpiration);
        console.log("today: ", today);
        if (itemExpiration < today) {
            console.log("Product is expired");
            return(<span className="badge badge-warning rounded-pill d-inline">Expired</span>);
        }
    }
    return(createBadgeExpiration(itemExpiration))
}