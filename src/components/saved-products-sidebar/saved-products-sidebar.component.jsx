import { Divider, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from "@mui/material";
import React from "react";
import './saved-products-sidebar.styles.scss';

const ProductSideBar = ({products, onClick}) => {


    const handleClick = (product) => {
        if(onClick){
            onClick(product);
        }
    }

    return (
        <div>
            <Toolbar>
                <Typography color="inherit" variant="h6" noWrap component="div">Products</Typography>
            </Toolbar>
            <Divider sx={{backgroundColor: 'white'}}/>
            <List>
                {products.map((product) => (
                    <ListItem key={product.title} disablePadding>
                        <ListItemButton onClick={() => handleClick(product)}>
                            <ListItemText primary={product.title} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

}

export default ProductSideBar;