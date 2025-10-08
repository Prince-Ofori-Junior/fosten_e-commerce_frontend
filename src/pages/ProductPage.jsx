import React, { useState, useEffect, useRef, useCallback } from "react";
import ProductsGrid from "../components/ProductsGrid";
import Hero from "../components/Hero";

function ProductPage({ addToCart, searchTerm, selectedType }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cartUpdated, setCartUpdated] = useState(0);

  const observer = useRef();
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  // Listen for localStorage changes (cart clear, etc.)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "cartItems") setCartUpdated((prev) => prev + 1);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let url = `${API_BASE}/api/products?page=${page}&limit=${limit}`;
      if (selectedType) url += `&category=${encodeURIComponent(selectedType)}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const result = await res.json();

      let rows = [];
      let totalCount = 0;

      if (result.success && result.data) {
        if (Array.isArray(result.data.rows)) {
          rows = result.data.rows;
          totalCount = result.data.total || rows.length;
        } else if (Array.isArray(result.data)) {
          rows = result.data;
          totalCount = rows.length;
        }
      }

      setProducts((prev) => (page === 1 ? rows : [...prev, ...rows]));
      setTotal(totalCount);
      setHasMore(page < Math.ceil(totalCount / limit));
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, selectedType, searchTerm, API_BASE]);

  // Load products when filters/search/page changes OR when cart updates
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, cartUpdated]);

  // Infinite scroll: observe last product
  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) setPage((prev) => prev + 1);
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div>
      <Hero />

      {products.length ? (
        <ProductsGrid products={products} addToCart={addToCart} lastProductRef={lastProductRef} />
      ) : loading ? (
        <p style={{ textAlign: "center" }}>Loading products...</p>
      ) : (
        <p style={{ textAlign: "center" }}>No products available.</p>
      )}

      {loading && <p style={{ textAlign: "center" }}></p>}
    </div>
  );
}

export default ProductPage;
