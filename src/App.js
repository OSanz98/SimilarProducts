import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomeRoute from './routes/home/home.component';
import SavedProductsRoute from './routes/saved-products/saved-products.component';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeRoute />
  },
  {
    path:"/saved-products",
    element: <SavedProductsRoute />
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
}

export default App;
