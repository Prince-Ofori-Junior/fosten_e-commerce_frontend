import React, { useState } from "react";

function InfoBar({ onCartClick, onHamburgerClick, onSearch, cartCount }) {
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (onSearch) onSearch(value); // send value to App
  };

  return (
    <div className="infobar">
      <div className="infobar-left">
        <button className="hamburger" onClick={onHamburgerClick}>☰</button>
        <div className="logo">MyBrand</div>
      </div>

      <div className="infobar-center">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleChange}
        />
      </div>

      <div className="infobar-right">
        <a href="#!" className="account-link">
          <i className="fas fa-user"></i> Sign In
        </a>
        <button className="cart-btn" onClick={onCartClick}>
          <i className="fas fa-shopping-cart"></i>
          <span id="cartCount">{cartCount}</span>
        </button>
      </div>
    </div>
  );
}

export default InfoBar;
