import React from "react";
import "../App.css";
const Navbar = () => {
  return (
    <nav style={{backgroundColor: "#f8f8f8", padding: "10px", width: "400px"}}>
      <a href="#" style={{textDecoration: "none", color: "#555"}}>
        Logo
      </a>
      <div style={{float: "right"}}>
        <a
          href="#"
          style={{textDecoration: "none", color: "#555", marginRight: "10px"}}
        >
          Link 1
        </a>
        <a
          href="#"
          style={{textDecoration: "none", color: "#555", marginRight: "10px"}}
        >
          Link 2
        </a>
        <a
          href="#"
          style={{textDecoration: "none", color: "#555", marginRight: "10px"}}
        >
          Link 3
        </a>
        <a
          href="#"
          style={{textDecoration: "none", color: "#555", marginRight: "10px"}}
        >
          Link 4
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
