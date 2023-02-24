import React from "react";
import './saved-products-sidebar.styles.scss';
import SidebarMenu from "react-bootstrap-sidebar-menu";

const ProductSideBar = ({products, onClick}) => {

    const handleClick = (product) => {
        if(onClick){
            onClick(product);
        }
    }

    return(
        <nav className="product-sidebar">
            <ul>
                {products.map((product) => (
                    <li key={product.title}>
                        <button className="sidebar-link" onClick={() => handleClick(product)}>{product.title}</button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default ProductSideBar;