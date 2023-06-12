import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Login from "./Login";

const Navbar = () => (
  <Router>
    <nav
      style={{
        backgroundColor: "#black",
        padding: "10px",
        width: "400px",
        margin: "10px",
      }}
    >
      <div style={{ float: "right", lineHeight: "100%" }}>
        <Link
          to="/"
          style={{ textDecoration: "none", color: "#555", marginRight: "10px" }}
        >
          Home
        </Link>
        <Link
          to="/about"
          style={{ textDecoration: "none", color: "#555", marginRight: "10px" }}
        >
          Link
        </Link>
        <Link
          to="/login"
          style={{ textDecoration: "none", color: "#555", marginRight: "10px" }}
        >
          Link 3
        </Link>
      </div>
    </nav>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </Router>
);

export default Navbar;
