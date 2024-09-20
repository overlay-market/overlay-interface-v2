import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme as DefaultRadixTheme } from "@radix-ui/themes";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme/theme.ts";
import { Provider } from "react-redux";
import store from "./state/state.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <DefaultRadixTheme>
            <App />
          </DefaultRadixTheme>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
