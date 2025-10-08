// ------------------- DISABLE CONSOLE LOGS IN PRODUCTION -------------------
if (process.env.NODE_ENV === "production") {
  const noop = () => {};
  console.log = noop;
  console.info = noop;
  console.warn = noop;
  console.error = noop;
  console.debug = noop;
}

// ------------------- EXISTING IMPORTS -------------------
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import TopBar from "./components/TopBar";
import InfoBar from "./components/InfoBar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MobileNavSidebar from "./components/MobileNavSidebar";
import CartSidebar from "./components/CartSidebar";

import ProductPage from "./pages/ProductPage";
import FurniturePage from "./pages/FurniturePage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";       
import RegisterPage from "./pages/RegisterPage"; 
import OrderSuccess from "./pages/OrderSuccess"; // ✅ Added import

import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// ------------------- YOUR APP COMPONENT -------------------
function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedCategory, setSelectedCategory] = useState(null);

  const addToCart = (product) => setCartItems([...cartItems, product]);
  const removeFromCart = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
  };
  const clearCart = () => setCartItems([]);

  return (
    <Router>
      <TopBar />
      <InfoBar
        onCartClick={() => setCartOpen(true)}
        onHamburgerClick={() => setMobileNavOpen(true)}
        onSearch={(term) => setSearchTerm(term)}
        cartCount={cartItems.length}
      />
      <Navbar />
      <MobileNavSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
      />

      <Routes>
        <Route
          path="/"
          element={
            <ProductPage
              addToCart={addToCart}
              searchTerm={searchTerm}
              selectedType={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          }
        />
        <Route
          path="/furniture"
          element={
            <FurniturePage
              addToCart={addToCart}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <CheckoutPage
              cartItems={cartItems}
              setCartItems={setCartItems}
              clearCart={clearCart}
            />
          }
        />

        {/* ✅ Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ✅ Order Success Route */}
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
