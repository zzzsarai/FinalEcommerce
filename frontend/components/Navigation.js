import React from "react";
import { NavLink } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import glazyDaysLogo from "../assets/glazyDayslogo.png";
import "../styles/Nav.css";

function Navigation({ cartCount }) {
  return (
    <nav className="navigation">
      <div className="nav-left">
        <img src={glazyDaysLogo} alt="Glazy Days Logo" className="logo-img" />
        <h2 className="logo-text">Glazy Days</h2>
      </div>

      <ul className="nav-links">
        <li><NavLink to="/">Home</NavLink></li>
        <li className="cart-link">
          <NavLink to="/cart" className="cart-icon">
            <FaShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
