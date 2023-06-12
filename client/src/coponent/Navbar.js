import React from "react";
import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Login from "./Login";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  return (
    <Router>
      <nav class="navbar navbar-expand-sm navbar-dark bg-dark fixed-top">
        <div class="container-fluid">
          <a class="navbar-brand">TodoList</a>
          <div class="collapse navbar-collapse" id="mynavbar">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <Link class="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/login">
                  Link
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/about">
                  Link
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default Navbar;
