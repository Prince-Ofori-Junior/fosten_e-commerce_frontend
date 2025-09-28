import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CheckoutPage({ cartItems, clearCart, userId }) {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  // Fetch available payment methods + delivery details from backend
  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const [methodsRes, deliveryRes] = await Promise.all([
          axios.get("/api/checkout/payment-methods"),
          axios.get(`/api/checkout/delivery-details/${userId}`)
        ]);

        setPaymentOptions(methodsRes.data); // [{id, label, icon, description}, ...]
        setDeliveryDetails(deliveryRes.data);
        if (methodsRes.data.length > 0) {
          setPaymentMethod(methodsRes.data[0].id); // default first option
        }
      } catch (err) {
        console.error("Error loading checkout data", err);
      }
    };
    fetchCheckoutData();
  }, [userId]);

  // Handle confirm order (submit to backend)
  const handleConfirmOrder = async () => {
    try {
      const res = await axios.post("/api/orders", {
        userId,
        items: cartItems,
        total,
        paymentMethod,
      });

      if (res.data.success) {
        alert("Order placed successfully!");
        clearCart();
        navigate("/order-success");
      } else {
        alert("Order failed. Please try again.");
      }
    } catch (err) {
      console.error("Order submission failed", err);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      {/* Delivery Section */}
      <div className="checkout-section delivery">
        <h3>Delivery Details</h3>
        {deliveryDetails ? (
          <p>
            <strong>{deliveryDetails.name}</strong><br />
            {deliveryDetails.address}<br />
            Phone: {deliveryDetails.phone}
          </p>
        ) : (
          <p>Loading delivery details...</p>
        )}
        <button className="btn change-btn">Change</button>
      </div>

      {/* Payment Section */}
      <div className="checkout-section payment">
        <h3>Payment Method</h3>
        <div className="payment-options">
          {paymentOptions.map((option) => (
            <label key={option.id} className="payment-option">
              <div className="payment-info">
                <span>{option.label}</span>
                {option.description && <small>{option.description}</small>}
              </div>
              {option.icon && <img src={option.icon} alt={option.label} />}
              <div className="payment-radio">
                <input
                  type="radio"
                  name="payment"
                  value={option.id}
                  checked={paymentMethod === option.id}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="checkout-section summary">
        <h3>Order Summary</h3>
        <ul className="order-items">
          {cartItems.map((item, index) => (
            <li key={index}>
              <img src={item.img} alt={item.name} className="order-item-img" />
              <span>{item.name}</span>
              <span>GH₵ {item.price}</span>
            </li>
          ))}
        </ul>
        <p className="total">
          <strong>Total: GH₵ {total.toFixed(2)}</strong>
        </p>
      </div>

      {/* Confirm Button */}
      <div className="checkout-actions">
        <button
          className="btn btn-primary confirm-btn"
          onClick={handleConfirmOrder}
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;
