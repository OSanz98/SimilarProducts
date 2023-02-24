import React, { useEffect, useState } from "react";
import ProductSideBar from "../../components/saved-products-sidebar/saved-products-sidebar.component";
import SavedProduct from "../../components/saved-product/saved-product.component";

const SavedProductsRoute = () => {
    const [products, setProducts] = useState([]);
    const [currentProduct, setCurrentProduct] = useState();

    const productHandler = (product) => {
        setCurrentProduct(product);
    };

    useEffect(() => {
        // fetch data from express js
        fetch('/api/products')
        .then((response) => response.json())
        .then((data) => setProducts(data))
        .catch((error) => console.error(error));
    }, []);

    return(
        <div>
            <ProductSideBar products={products} onClick={productHandler}/>
            <SavedProduct product={currentProduct} />
        </div>
    );
};

export default SavedProductsRoute;