import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme as DefaultRadixTheme } from "@radix-ui/themes";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import theme from "./theme";
import { Provider } from "react-redux";
import store from "./state/state.tsx";
import Web3Provider from "./providers/Web3Provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Web3Provider>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <DefaultRadixTheme>
              <App />
            </DefaultRadixTheme>
          </ThemeProvider>
        </BrowserRouter>
      </Web3Provider>
    </Provider>
  </React.StrictMode>
);
