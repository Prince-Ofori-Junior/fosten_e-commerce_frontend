import React from "react";
import { useNavigate } from "react-router-dom";

function CartSidebar({ open, onClose, items, onRemove }) {
  const navigate = useNavigate(); // ✅ Add navigate
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    onClose(); // close the sidebar
    navigate("/checkout"); // navigate to checkout page
  };

  return (
    <div className={`cart-sidebar ${open ? "open" : ""}`}>
      <button className="close-cart" onClick={onClose}>&times;</button>
      <h3>Shopping Cart</h3>

      <div className="cart-content">
        <ul id="cartItems">
          {items.map((item, index) => (
            <li key={index}>
              <img src={item.img} alt={item.name} />
              <span>{item.name} - GHS {item.price}</span>
              <button onClick={() => onRemove(index)}>Remove</button>
            </li>
          ))}
        </ul>
        <p className="cart-total">Total: GHS <span id="cartTotal">{total}</span></p>
      </div>

      {/* ✅ Add onClick to navigate */}
      <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
        Checkout
      </button>
    </div>
  );
}

export default CartSidebar;
