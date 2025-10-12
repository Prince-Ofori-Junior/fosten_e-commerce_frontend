import React, { useState, useEffect } from "react";
import CategoryBar from "../components/CategoryBar";
import ProductsGrid from "../components/ProductsGrid";

// Optionally, you can import images dynamically from a CDN or environment path
const furnitureImages = {
  chairs: process.env.REACT_APP_PLACEHOLDER_IMAGE,
  tables: process.env.REACT_APP_PLACEHOLDER_IMAGE,
  sofas: process.env.REACT_APP_PLACEHOLDER_IMAGE,
  beds: process.env.REACT_APP_PLACEHOLDER_IMAGE,
  wardrobe: process.env.REACT_APP_PLACEHOLDER_IMAGE,
};

function FurniturePage({ addToCart, searchTerm }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [meta, setMeta] = useState({ page: 1, limit: 6, total: 0 });
  const [loading, setLoading] = useState(true);

  // Categories (IDs could come from backend in real app)
  const categories = [
    { id: "uuid-chairs-123", name: "Chairs", img: furnitureImages.chairs },
    { id: "uuid-tables-456", name: "Tables", img: furnitureImages.tables },
    { id: "uuid-sofas-789", name: "Sofas", img: furnitureImages.sofas },
    { id: "uuid-beds-101", name: "Beds", img: furnitureImages.beds },
    { id: "uuid-wardrobe-112", name: "Wardrobe", img: furnitureImages.wardrobe },
  ];

  useEffect(() => {
    const fetchFurniture = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const API_BASE = process.env.REACT_APP_API_BASE_URL;
        let url = `${API_BASE}/api/admin/products?type=furniture&page=${meta.page}&limit=${meta.limit}`;
        if (selectedCategory) url += `&category=${encodeURIComponent(selectedCategory)}`;
        if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const result = await res.json();

        if (result.rows) {
          setProducts(result.rows);
          setMeta((prev) => ({ ...prev, total: result.total }));
        } else {
          setProducts([]);
          setMeta((prev) => ({ ...prev, total: 0 }));
        }
      } catch (err) {
        console.error("Error fetching furniture:", err);
        setProducts([]);
        setMeta((prev) => ({ ...prev, total: 0 }));
      } finally {
        setLoading(false);
      }
    };

    fetchFurniture();

    // 🔄 Auto-refresh every 30s
    const interval = setInterval(fetchFurniture, 30000);
    return () => clearInterval(interval);
  }, [selectedCategory, searchTerm, meta.page, meta.limit]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setMeta((prev) => ({ ...prev, page: 1 }));
  };

  const handlePrev = () => {
    if (meta.page > 1) setMeta((prev) => ({ ...prev, page: prev.page - 1 }));
  };

  const handleNext = () => {
    const totalPages = Math.ceil(meta.total / meta.limit);
    if (meta.page < totalPages) setMeta((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  return (
    <div>
      <CategoryBar categories={categories} onCategoryClick={handleCategoryClick} />

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading furniture...</p>
      ) : products.length ? (
        <ProductsGrid products={products} addToCart={addToCart} />
      ) : (
        <p style={{ textAlign: "center" }}>No furniture available.</p>
      )}

      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button onClick={handlePrev} disabled={meta.page === 1}>
          ◀ Prev
        </button>
        <span style={{ margin: "0 1rem" }}>
          Page {meta.page} of {Math.max(1, Math.ceil(meta.total / meta.limit))}
        </span>
        <button
          onClick={handleNext}
          disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

export default FurniturePage;
