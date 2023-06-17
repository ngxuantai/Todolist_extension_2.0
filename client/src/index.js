import React from "react";
// import ReactDOM from "react-dom";
import {createRoot} from "react-dom/client";
import "./index.css";
import Navbar from "./coponent/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Navbar />
  </React.StrictMode>
);
