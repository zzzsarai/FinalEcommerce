import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import glazyDaysLogo from "../assets/glazyDayslogo.png";
import "../styles/Nav.css";

function Navigation({ cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navigation">
      <div className="nav-left">
        <img src={glazyDaysLogo} alt="Glazy Days Logo" className="logo-img" />
        <h2 className="logo-text">Glazy Days</h2>
      </div>

      {/* Desktop Links */}
      <ul className="nav-links">
        <li><NavLink to="/">Home</NavLink></li>
        <li className="cart-link">
          <NavLink to="/cart" className="cart-icon">
            <FaShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </NavLink>
        </li>
      </ul>

      {/* Hamburger for mobile */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <div style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }}></div>
        <div style={{ opacity: menuOpen ? 0 : 1 }}></div>
        <div style={{ transform: menuOpen ? "rotate(-45deg) translate(6px, -6px)" : "none" }}></div>
      </div>

      {/* Floating Menu Card */}
      <div className={`floating-menu ${menuOpen ? "active" : ""}`}>
        <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/cart" onClick={() => setMenuOpen(false)}>
          Cart {cartCount > 0 && `(${cartCount})`}
        </NavLink>
      </div>
    </nav>
  );
}

export default Navigation;
