import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-logo">3d model HUB</div>
      <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "☰"}
      </button>
      <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/" onClick={() => setIsOpen(false)}>Dashboard</Link>
        </li>
        <li className={location.pathname === "/View3DModel" ? "active" : ""}>
          <Link to="/View3DModel" onClick={() => setIsOpen(false)}>View Models</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
