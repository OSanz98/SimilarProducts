import { Button, Card, CardActions, CardContent, CardHeader, Divider, IconButton, Toolbar, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";
import theme from "../../constants/styling/colors";
import { useNavigate } from "react-router-dom";

const SavedProduct = ({ product, similarProducts, refreshAction, loading }) => {
    const navigate = useNavigate();

    const handleCreateProduct = () => {
        // once created find similar page navigate to that page
        // navigate('/find-products');
        console.log('Find Similar products clicked');
    };

    const  handleRefresh = () => {
        if(refreshAction){
            refreshAction(product.title);
        }
    };

    if(!product) {
        return (
            <Card>
                <CardHeader 
                    title="No Products Selected"
                />
                <CardContent>
                    <CardActions>
                        <Button size="medium" onClick={handleCreateProduct}>
                            <AddIcon />
                            Create new product
                        </Button>
                    </CardActions>
                </CardContent>
            </Card>
        );
    }

    return(
        <Card>
            <CardHeader 
                title={product.title}
                action={
                    <div>
                        <IconButton aria-label="refresh" onClick={handleRefresh}>
                            {loading ? <CircularProgress sx={{color: 'primary'}} /> : <RefreshIcon />}
                        </IconButton>
                        <IconButton aria-label="edit">
                            <EditIcon />
                        </IconButton>
                        <IconButton aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </div>
                }
            />
            <CardContent>
                <Typography variant="h6" color="primary">
                    URL:
                </Typography>
                <Typography variant="body2" color="primary">
                    {product.url}
                </Typography>
                <Toolbar style={{
                    height: '10px',
                    color: 'black'
                }} />
                <Divider />
                <Typography variant="h6" color="primary">
                    Similar Products:
                </Typography>

                {similarProducts && similarProducts.length > 0 ? (
                    similarProducts.map((product) => (
                        <Typography key={product.title}>{product.title}</Typography>
                    ))
                ) : (
                    <Typography variant="body2" color="primary">No similar products stored</Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default SavedProduct;