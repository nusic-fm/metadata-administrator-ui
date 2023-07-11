import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import theme from "./theme";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/alive",
    element: <App />,
  },
]);

const getLibrary = (provider: any) => {
  return new Web3Provider(provider);
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
      {/* <Web3ReactProvider getLibrary={getLibrary}>
      <RouterProvider router={router} />
    </Web3ReactProvider> */}
    </ThemeProvider>
  </React.StrictMode>
);
