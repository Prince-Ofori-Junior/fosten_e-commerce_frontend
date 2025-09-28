import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-header">
        <ul className="nav-links">
          <li><Link to="/home">Home</Link></li>
          <li className="dropdown">
            <Link to="/product">Products ▾</Link>
            <ul className="dropdown-menu">
              <li><Link to="/furniture">Furnitures</Link></li>
              <li><Link to="#">Food & Beverages</Link></li>
            </ul>
          </li>
          <li><Link to="#">About</Link></li>
          <li><Link to="#">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
