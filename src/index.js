import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";

import TrafficController from "./TrafficController";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <TrafficController />
  </React.StrictMode>,
  rootElement
);
