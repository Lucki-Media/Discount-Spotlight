import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { CONST } from "./constants";
import { config } from "../config";
import "./custom.css";
import "react-toastify/dist/ReactToastify.css";
import TestRenderer from "../components/TestRenderer/TestRenderer";

const { STICKY_ICON } = CONST;

const App = () => {
  const test_renderer = document.querySelector(
    "." + config[STICKY_ICON].className
  );

  return (
    <>
      {test_renderer && ReactDOM.createPortal(<TestRenderer />, test_renderer)}
    </>
  );
};

export default App;
