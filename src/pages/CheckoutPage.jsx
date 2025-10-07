import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import whatsappLogo from '../assets/WhatsApp.jpg';



// ------------------- IMAGE RESOLVER -------------------
const resolveImage = (item, width = 80, height = 80) => {
  const img = item.image_url || item.img || item.image || "";
  if (img.startsWith("http")) return img;
  if (!img) return process.env.REACT_APP_PLACEHOLDER_IMAGE || "/placeholder.png";

  const publicId = img.replace(/\.(jpg|jpeg|png|webp|gif)$/i, "");
  const versionSegment = item.version ? `/v${item.version}` : "";
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

  return `https://res.cloudinary.com/${cloudName}/image/upload${versionSegment}/c_fill,w_${width},h_${height}/${publicId}`;
};


const Checkout = ({ cartItems, setCartItems }) => {
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const [deliveryLoading, setDeliveryLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMainPayment, setSelectedMainPayment] = useState(null);
  const [selectedSubPayment, setSelectedSubPayment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // ------------------- COMPUTE TOTAL -------------------
  const total = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity || 1),
    0
  );

  // ------------------- FETCH DELIVERY & PAYMENT METHODS -------------------
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return navigate("/login");

  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const fetchDelivery = async () => {
    try {
      setDeliveryLoading(true);
      const res = await fetch(`${API_BASE}/api/checkout/delivery-details`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401) return navigate("/login");
      if (!res.ok) throw new Error("Failed to fetch delivery details");
      const data = await res.json();
      setDeliveryDetails({
        name: data.data.name || "",
        address: data.data.address || "",
        phone: data.data.phone || "",
        email: data.data.email || "",
      });
    } catch (err) {
      console.error("❌ Error fetching delivery details:", err);
    } finally {
      setDeliveryLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      setPaymentLoading(true);
      const res = await fetch(`${API_BASE}/api/checkout/payment-methods`);
      if (!res.ok) throw new Error("Failed to fetch payment methods");
      const data = await res.json();
      if (data.success) setPaymentMethods(data.methods || []);
    } catch (err) {
      console.error("❌ Error fetching payment methods:", err);
    } finally {
      setPaymentLoading(false);
    }
  };

  fetchDelivery();
  fetchPaymentMethods();
}, [navigate]);

  // ------------------- SAVE DELIVERY DETAILS -------------------
const handleSaveDeliveryDetails = async () => {
  const token = localStorage.getItem("token");
  if (!token) return navigate("/login");

  const { name, address, phone, email } = deliveryDetails;
  if (!name || !address || !phone || !email)
    return alert("All fields are required!");

  try {
    const API_BASE = process.env.REACT_APP_API_BASE_URL;
    const res = await fetch(`${API_BASE}/api/checkout/delivery`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(deliveryDetails),
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.message || "Delivery details updated successfully!");
      setIsEditing(false);
    } else {
      alert(data.message || "Failed to update delivery details.");
    }
  } catch (err) {
    console.error("❌ Update failed:", err);
    alert("Something went wrong while updating delivery details.");
  }
};


  // ------------------- HANDLE QUANTITY CHANGE -------------------
  const handleQuantityChange = (itemId, newQuantity) => {
    const qty = Math.max(1, Number(newQuantity) || 1);
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: qty } : item
      )
    );
  };

  // ------------------- CONFIRM ORDER -------------------
  // ------------------- CONFIRM ORDER -------------------
const handleConfirmOrder = async () => {
  if (!selectedMainPayment || !selectedSubPayment)
    return alert("Please select a payment method and sub-type.");
  if (!cartItems.length) return alert("Cart is empty.");

  const token = localStorage.getItem("token");
  if (!token) return navigate("/login");

  setOrderLoading(true);

  try {
    const API_BASE = process.env.REACT_APP_API_BASE_URL;
    let paymentMethod = selectedMainPayment.method;
    let paymentChannel = selectedSubPayment.channel;

    if (paymentMethod === "mobile_money") paymentMethod = "momo";
    if (paymentMethod === "cod") paymentChannel = "cod_pickup";

    const payload = {
      items: cartItems.map((item) => ({
        productId: String(item.id || item.productId),
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
      })),
      totalAmount: total,
      paymentMethod,
      paymentChannel,
      address: deliveryDetails.address,
      email: deliveryDetails.email,
    };

    const res = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      if (data.payment?.authorizationUrl) {
        window.location.href = data.payment.authorizationUrl;
      } else {
        localStorage.removeItem("cartItems");
        setCartItems([]);
        navigate("/order-success?cod=true", {
          state: { order: { ...data.order, totalAmount: total } },
        });
      }
    } else {
      alert(data.message || "Order failed. Please try again.");
    }
  } catch (err) {
    console.error("❌ Order submission failed:", err);
    alert("Something went wrong. Try again.");
  } finally {
    setOrderLoading(false);
  }
};


  // ------------------- PAYMENT OPTIONS -------------------
  const renderPaymentGroup = (method) => {
    const titleMap = {
      cod: "Payment on Delivery",
      card: "Payment Card",
      mobile_money: "Mobile Money",
    };

    return (
      <section className="payment-group" key={method.method}>
        <h3>{titleMap[method.method] || method.method}</h3>
        {method.subMethods?.map((sub) => (
          <label key={sub.channel}>
            <input
              type="radio"
              name="payment-sub"
              checked={selectedSubPayment?.channel === sub.channel}
              onChange={() => {
                setSelectedMainPayment({ method: method.method });
                setSelectedSubPayment(sub);
              }}
            />
            {sub.label}
          </label>
        ))}
      </section>
    );
  };

  return (
    <div className="checkout-page">
      <div className="checkout-rows">
        {/* Delivery & Payment */}
        <div className="top-row">
          {/* Delivery Details */}
          <div className="checkout-section">
            <h2>Delivery Details</h2>
           {deliveryLoading ? (
  <p>Loading delivery details...</p>
) : !isEditing ? (
  <div>
    <p>
      <strong>Name:</strong> {deliveryDetails.name}
    </p>
    <br></br>
    <p>
      <strong>Address:</strong> {deliveryDetails.address}
    </p>
        <br></br>

    <p>
      <strong>Phone:</strong> {deliveryDetails.phone}
    </p>
        <br></br>

    <p>
      <strong>Email:</strong> {deliveryDetails.email}
    </p>
    
    <button
      className="btn change-btn"
      onClick={() => setIsEditing(true)}
    >
      Edit
    </button>

    {/* Logo / Image Below Delivery Details */}
    <div className="delivery-logo">
      <img src={whatsappLogo} alt="WhatsApp Logo" />
    </div>
  </div>
) : (
  <div className="delivery-form">
    <input
      type="text"
      placeholder="Name"
      value={deliveryDetails.name}
      onChange={(e) =>
        setDeliveryDetails({ ...deliveryDetails, name: e.target.value })
      }
    />
    <input
      type="text"
      placeholder="Address"
      value={deliveryDetails.address}
      onChange={(e) =>
        setDeliveryDetails({ ...deliveryDetails, address: e.target.value })
      }
    />
    <input
      type="text"
      placeholder="Phone Number"
      value={deliveryDetails.phone}
      onChange={(e) =>
        setDeliveryDetails({ ...deliveryDetails, phone: e.target.value })
      }
    />
    <input
      type="email"
      placeholder="Email"
      value={deliveryDetails.email}
      onChange={(e) =>
        setDeliveryDetails({ ...deliveryDetails, email: e.target.value })
      }
    />
    <button
      className="btn btn-primary"
      onClick={handleSaveDeliveryDetails}
    >
      Save
    </button>
  </div>
)}
          </div>

          {/* Payment Method */}
          <div className="checkout-section">
            <h2>Payment Method</h2>
            {paymentLoading
              ? <p>Loading payment methods...</p>
              : paymentMethods.map(renderPaymentGroup)}
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-section summary">
          <h2>Order Summary</h2>
          <ul className="order-items">
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <li key={`${String(item.id)}-${index}`}>
                  <img
                    src={resolveImage(item, 60, 60)}
                    alt={item.name || "Product"}
                    className="order-item-img"
                  />
                  <span>{item.name}</span>
                  <div className="quantity-stepper">
                    <button
                      className="stepper-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={(item.quantity ?? 1) <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity ?? 1}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    />
                    <button
                      className="stepper-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span>GHS {(Number(item.price) * Number(item.quantity ?? 1)).toFixed(2)}</span>
                </li>
              ))
            ) : (
              <p className="error-message">No items in cart</p>
            )}
          </ul>

          <div className="total">Total: GHS {total.toFixed(2)}</div>

          <div className="checkout-actions">
            <button
              className="btn btn-primary"
              onClick={handleConfirmOrder}
              disabled={!selectedMainPayment || !selectedSubPayment || !cartItems.length || orderLoading}
            >
              {orderLoading ? "Processing..." : "Confirm Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
