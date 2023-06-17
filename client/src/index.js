import React from "react";
// import ReactDOM from "react-dom";
import {createRoot} from "react-dom";
import "./index.css";
import Navbar from "./coponent/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

// ReactDOM.render(
//   <React.StrictMode>
//     <Navbar />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Navbar />
  </React.StrictMode>
);
