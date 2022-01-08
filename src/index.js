import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

const e = React.createElement;
const domContainer = document.querySelector("#atra-root");
ReactDOM.render(e(App), domContainer);
