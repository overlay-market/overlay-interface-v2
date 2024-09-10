import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme as DefaultRadixTheme } from "@radix-ui/themes";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme/theme.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <DefaultRadixTheme>
          <App />
        </DefaultRadixTheme>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
