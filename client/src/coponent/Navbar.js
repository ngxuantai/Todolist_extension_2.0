import React from "react";
import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Login from "./Login";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Navbar.css";

const Navbar = () => {
  return (
    <Router>
      {/* <nav
        class="navbar navbar-expand-sm navbar-dark bg-dark fixed-top"
        style={{width: "400px"}}
      >
        <div>
          <a class="navbar-brand">TodoList</a>
          <div class="collapse navbar-collapse" id="mynavbar">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <Link className="navbar-link" to="/">
                  Home
                </Link>
              </li>
              <li class="nav-item">
                <Link className="navbar-link" to="/login">
                  Link
                </Link>
              </li>
              <li class="nav-item">
                <Link className="navbar-link" to="/about">
                  Link
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav> */}

      <nav
        className="navbar navbar-expand-sm navbar-dark bg-dark fixed-top"
        style={{
          width: "400px",
          height: "50px",
        }}
      >
        <div>
          <a className="navbar-brand">TodoList</a>
          <Link className="navbar-link" to="/">
            Home
          </Link>
          <Link className="navbar-link" to="/login">
            Link 3
          </Link>
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
