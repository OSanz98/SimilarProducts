import React from "react";
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import HomeRoute from './routes/home/home.component';
import SavedProductsRoute from './routes/saved-products/saved-products.component';

import { MsalProvider } from "@azure/msal-react";

const authenticatedRoute = createBrowserRouter([
  {
    path: "/",
    element: <HomeRoute />
  },
  {
    path:"/saved-products",
    element: <SavedProductsRoute />
  },
]);

const App = ({pca}) => {
  return (  
    <MsalProvider instance={pca}>
      <RouterProvider router={authenticatedRoute} />
    </MsalProvider>
  );
}

export default App;
