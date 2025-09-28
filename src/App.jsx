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
import CheckoutPage from "./pages/CheckoutPage"; // ✅ New page

import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Track search input

  const addToCart = (product) => setCartItems([...cartItems, product]);
  const removeFromCart = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
  };

  const clearCart = () => setCartItems([]); // Clear cart after payment

  return (
    <Router>
      <TopBar />
      <InfoBar
        onCartClick={() => setCartOpen(true)}
        onHamburgerClick={() => setMobileNavOpen(true)}
        onSearch={(term) => setSearchTerm(term)}
        cartCount={cartItems.length} // pass cart count
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
          element={<ProductPage addToCart={addToCart} searchTerm={searchTerm} />}
        />
        <Route
          path="/furniture"
          element={<FurniturePage addToCart={addToCart} searchTerm={searchTerm} />}
        />
        <Route
          path="/checkout"
          element={
            <CheckoutPage
              cartItems={cartItems}
              clearCart={clearCart}
            />
          }
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
