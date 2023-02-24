import React from "react";
import {Col} from 'react-bootstrap';
import './category-item.styles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const CategoryItem = ({ category, onClick }) => {
    const { title, imageUrl, imageTitle } = category;

    const handleClick = (categoryTitle) => {
        if(onClick){
            onClick(categoryTitle);
        }
    }

    return(
        <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            <div className="category-container" onClick={() => handleClick(category.title)}>
                <div className="image-container">
                    <img className='background-image' src={imageUrl} alt={imageTitle} />
                </div>
                <div className="category-body-container">
                    <h2>{title}</h2>
                </div>
            </div>
        </Col>
    );
}

export default CategoryItem;