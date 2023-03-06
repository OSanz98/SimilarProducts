import React, { useEffect, useState } from "react";
import ProductSideBar from "../../components/saved-products-sidebar/saved-products-sidebar.component";
import SavedProduct from "../../components/saved-product/saved-product.component";
import './saved-products.styles.scss';
import { AppBar, Box, CssBaseline, Drawer, IconButton, Toolbar, Typography, ThemeProvider } from "@mui/material";
import theme from "../../constants/styling/colors";
import MenuIcon from '@mui/icons-material/Menu';
import { findSimilarProducts } from "../../config/apiCalls";

const drawerWidth = 240;

const SavedProductsRoute = (props) => {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [currentProduct, setCurrentProduct] = useState();
    const [loading, setLoading] = useState(false);

    const productHandler = (product) => {
        if(currentProduct === undefined){
            setCurrentProduct(product);
            handleGatherSimilarProducts(product.title);
        } else if(product.title !== currentProduct.title) {
            setCurrentProduct(product);
            handleGatherSimilarProducts(product.title);
        }
        
        setMobileOpen(!mobileOpen);
    };

    const handleGatherSimilarProducts = (title) => {
        fetch(`/api/similar/:productTitle=${title}`)
        .then((response) => response.json())
        .then((data) => {
            setSimilarProducts(data);
            console.log(data);
        })
        .catch((error) => console.error(error));
    };

    const handleFindProducts = async (title) => {
        try {
            setLoading(true);
            await findSimilarProducts(title)
            .then((responseData) => {
                if(responseData) {
                    console.log(responseData);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
        } catch(err) {
            console.log(err);
        } 
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const container = window !== undefined ? () => window().document.body : undefined;

    useEffect(() => {
        // fetch data from express js
        fetch('/api/products')
        .then((response) => response.json())
        .then((data) => setProducts(data))
        .catch((error) => console.error(error));
    }, []);

    return(
        <ThemeProvider theme={theme}>
            <Box sx={{display: 'flex'}}>
                {/* header bar */}
                <CssBaseline />
                <AppBar position="fixed" sx={{
                    width: {sm: `calc(100% - ${drawerWidth}px)`},
                    ml: {sm: `${drawerWidth}px`},
                }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx = {{ mr: 2, display: {sm: 'none'}}}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            View Similar Products
                        </Typography>
                    </Toolbar>
                </AppBar>
                {/* body */}
                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    aria-label="saved products folders"
                    
                >
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth,},
                        }}
                        PaperProps= {{
                            sx: {
                                backgroundColor: theme.palette.background.drawer,
                                color: "white"
                            }
                        }}
                        
                    >
                        <ProductSideBar products={products} onClick={productHandler} />
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                            backgroundColor: 'black'
                        }}
                        PaperProps= {{
                            sx: {
                                backgroundColor: theme.palette.background.drawer,
                                color: "white"
                            }
                        }}
                        open
                    >
                        <ProductSideBar products={products} onClick={productHandler} />
                    </Drawer>
                </Box>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
                >
                    <Toolbar />
                    <SavedProduct product={currentProduct} similarProducts={similarProducts} refreshAction={handleFindProducts} loading={loading} />
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default SavedProductsRoute;