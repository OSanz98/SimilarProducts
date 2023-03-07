import React from "react";
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import HomeRoute from './routes/home/home.component';
import SavedProductsRoute from './routes/saved-products/saved-products.component';

import { MsalProvider } from "@azure/msal-react";
// import { CustomNavigationClient } from "./utils/NavigationClient.component";

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

  // const navigate = useNavigate();
  // const navigationClient = new CustomNavigationClient(navigate);
  // pca.setNavigationClient(navigationClient);

  // const request = {
  //   loginHint: "name@example.com",
  //   scopes: ["User.Read"]
  // }
  // const { login,  error } = useMsalAuthentication(InteractionType.Silent, request);

  // useEffect(() => {
  //     if (error instanceof InteractionRequiredAuthError) {
  //         login(InteractionType.Popup, request);
  //     }
  // }, [error]);

  return (  
    <MsalProvider instance={pca}>
      <RouterProvider router={authenticatedRoute} />
    </MsalProvider>
  );
}

export default App;
