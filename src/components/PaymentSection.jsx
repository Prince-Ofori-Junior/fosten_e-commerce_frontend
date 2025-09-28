import React from "react";

function PaymentSection({ paymentMethod, setPaymentMethod }) {
  return (
    <section className="checkout-section payment-section">
      <h3>Payment Method</h3>
      <label>
        <input
          type="radio"
          name="payment"
          value="Pay on Delivery"
          checked={paymentMethod === "Pay on Delivery"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Pay on Delivery
      </label>
      <label>
        <input
          type="radio"
          name="payment"
          value="Mobile Money"
          checked={paymentMethod === "Mobile Money"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Pay with Mobile Money (MTN, AirtelTigo, Telecel)
      </label>
      <label>
        <input
          type="radio"
          name="payment"
          value="Card"
          checked={paymentMethod === "Card"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Pay with Card
      </label>
    </section>
  );
}

export default PaymentSection;
