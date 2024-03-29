import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

export async function init() {
  // Render App component as child of ".lm_ds_discount_label_q78er"
  document.querySelectorAll(".lm_ds_discount_label_q78er").forEach((t) => {
    ReactDOM.render(<App productId={t.id} />, t);
  });
}
