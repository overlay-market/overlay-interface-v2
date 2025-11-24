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
import MiniAppSdkProvider from "./providers/MiniAppSdkProvider";
import MiniAppGate from "./components/MiniAppGate";

const assets = import.meta.glob(
  "/src/assets/**/*.{png,jpg,jpeg,webp,gif,mp4}",
  { eager: true }
);

function preloadAssets() {
  Object.values(assets).forEach((asset) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = (asset as { default: string }).default;

    // Set correct resource type
    if (link.href.endsWith(".mp4")) {
      link.as = "video";
      link.setAttribute("importance", "high"); // Set high priority for videos
    } else {
      link.as = "image"; // Normal priority for images
    }

    document.head.appendChild(link);
  });
}

preloadAssets();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <MiniAppSdkProvider>
        <Web3Provider>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <DefaultRadixTheme>
                <MiniAppGate>
                  <App />
                </MiniAppGate>
              </DefaultRadixTheme>
            </ThemeProvider>
          </BrowserRouter>
        </Web3Provider>
      </MiniAppSdkProvider>
    </Provider>
  </React.StrictMode>
);
