import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const createReactApp = () => {
  const appContainer = document.createElement("div");
  appContainer.id = "app-container-q78er";
  document.body.append(appContainer);
  const appElement = document.querySelector("#app-container-q78er");
  if (appElement) {
    ReactDOM.render(<App />, appElement);
  }
};


export async function init() {
  createReactApp();
}
