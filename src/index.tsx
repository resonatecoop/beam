import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GlobalStateProvider } from "./contexts/globalState";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { SnackBarContextProvider } from "contexts/SnackbarContext";
import { ThemeProvider } from "@emotion/react";
import { theme } from "utils/theme";

const InsideRouter = () => (
  <ThemeProvider theme={theme}>
    <SnackBarContextProvider>
      <GlobalStateProvider>
        <App />
      </GlobalStateProvider>
    </SnackBarContextProvider>
  </ThemeProvider>
);

var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(" electron/") > -1) {
  ReactDOM.render(
    <React.StrictMode>
      <MemoryRouter>
        <InsideRouter />
      </MemoryRouter>
    </React.StrictMode>,
    document.getElementById("root")
  );
} else {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <InsideRouter />
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
