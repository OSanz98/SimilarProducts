import React from "react";

const SavedProduct = ({ product }) => {

    if(!product) {
        return <div>Product not found</div>;
    }

    return(
        <div className="product-container">
            <h2>{product.title}</h2>
            <p>{product.url}</p>
        </div>
    );
};

export default SavedProduct;