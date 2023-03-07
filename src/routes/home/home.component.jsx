import React from 'react';
import Directory from '../../components/directory/directory.component';
import categories from '../../constants/data/category-data';
import UnAuthenticatedRoute from '../unauthenticated/unauthenticated.component';
import { Box, AppBar, Toolbar, Typography, CssBaseline} from '@mui/material'
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import AuthButton from '../../components/auth-button/auth-button.component';

const HomeRoute = () => {
    return(
        <Box sx={{display: 'flex'}}>
            {/* header bar */}
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Similar Producs Application
                    </Typography>
                    <div style={{marginLeft: 'auto', marginRight: '20px'}}>
                        <AuthButton />
                    </div>
                </Toolbar>
            </AppBar>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3 }}
            >
                <Toolbar />

                <AuthenticatedTemplate>
                    <Directory categories={categories} />
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <UnAuthenticatedRoute />
                </UnauthenticatedTemplate>
            </Box>
            
        </Box>
    );
};

export default HomeRoute;