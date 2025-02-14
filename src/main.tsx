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
import { ArcxAnalyticsProvider } from '@0xarc-io/analytics';

const images = import.meta.glob("/src/assets/**/*.{png,jpg,jpeg,webp,gif,mp4}", { eager: true });

function preloadImages() {
  Object.values(images).forEach((img) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = (img as { default: string }).default;
    link.as = "image";
    document.head.appendChild(link);
  });
}

preloadImages();

const apiKey = "44242b32c3a5151254dc2bdc85fe66dbcc9f70da4c6d3abfca236acb30d9e6e8";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Web3Provider>
        <ArcxAnalyticsProvider apiKey={apiKey}>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <DefaultRadixTheme>
                <App />
              </DefaultRadixTheme>
            </ThemeProvider>
          </BrowserRouter>
        </ArcxAnalyticsProvider>
      </Web3Provider>
    </Provider>
  </React.StrictMode>
);
