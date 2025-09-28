import React, { useState } from "react";

function PayNowModal({ open, paymentMethod, onClose, onConfirm }) {
  const [paymentDetails, setPaymentDetails] = useState({
    mobileNumber: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const handleConfirm = () => {
    alert(`Payment confirmed via ${paymentMethod}!`);
    onConfirm();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Pay Now - {paymentMethod}</h3>
        <button className="close-modal" onClick={onClose}>×</button>

        {paymentMethod === "Mobile Money" && (
          <div className="payment-form">
            <label>
              Mobile Number:
              <input
                type="text"
                name="mobileNumber"
                value={paymentDetails.mobileNumber}
                onChange={handleChange}
                placeholder="+233 55 699 2875"
              />
            </label>
          </div>
        )}

        {paymentMethod === "Card" && (
          <div className="payment-form">
            <label>
              Card Number:
              <input
                type="text"
                name="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
              />
            </label>
            <label>
              Expiry Date:
              <input
                type="text"
                name="expiry"
                value={paymentDetails.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
              />
            </label>
            <label>
              CVV:
              <input
                type="text"
                name="cvv"
                value={paymentDetails.cvv}
                onChange={handleChange}
                placeholder="123"
              />
            </label>
          </div>
        )}

        <button className="btn btn-primary" onClick={handleConfirm}>
          Confirm Payment
        </button>
      </div>
    </div>
  );
}

export default PayNowModal;
