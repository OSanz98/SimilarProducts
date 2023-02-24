import React, { useEffect, useState } from "react";
import ProductSideBar from "../../components/saved-products-sidebar/saved-products-sidebar.component";
import SavedProduct from "../../components/saved-product/saved-product.component";
import './saved-products.styles.scss';

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
        <div className="saved-products-container">
            <div className="product-sidebar-container">
                <ProductSideBar products={products} onClick={productHandler}/>
            </div>
            <div className="product-data-container">
                <SavedProduct product={currentProduct} />
            </div>
        </div>
    );
};

export default SavedProductsRoute;