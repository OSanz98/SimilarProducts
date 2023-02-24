import React from "react";
import {Container, Row} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import CategoryItem from "../category-item/category-item.component"
import './directory.styles.scss';

const Directory = ({ categories }) => {

    const navigate = useNavigate();

    const categoryHandler = (title) => {
        switch (title) {
            case "Saved Products":
                navigate('/saved-products');
                break;
            case "Find Similar Products":
                console.log('Find Similar products clicked');
                break;
            default:
                break;
        }
    };

    return (    
        <Container className="categories-container">
            <Row>
                {categories.map((category) => (
                    <CategoryItem key={category.id} category={category} onClick={categoryHandler}/> 
                ))}
            </Row>
        </Container>
    )
};

export default Directory;