import React, { useState, useEffect } from "react";
import CategoryBar from "../components/CategoryBar";
import ProductsGrid from "../components/ProductsGrid";

function FurniturePage({ addToCart, searchTerm }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 6 }); // default limit = 6 per page
  const [loading, setLoading] = useState(true);

  // 🔄 fetch products whenever category/search/page changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        let url = `http://localhost:8000/api/products?type=furniture&page=${meta.page}&limit=${meta.limit}`;

        if (selectedCategory) {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }

        if (searchTerm) {
          url += `&search=${encodeURIComponent(searchTerm)}`;
        }

        const res = await fetch(url);
        const json = await res.json();

        if (json.success && json.data) {
          setProducts(json.data.rows || []);
          setMeta((prev) => ({
            ...prev,
            total: json.data.total,
            page: json.data.page,
            limit: json.data.limit,
          }));
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchTerm, meta.page, meta.limit]); // ✅ refetch on page change

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setMeta((prev) => ({ ...prev, page: 1 })); // reset to page 1 when category changes
  };

  const handlePrev = () => {
    if (meta.page > 1) {
      setMeta((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleNext = () => {
    const totalPages = Math.ceil(meta.total / meta.limit);
    if (meta.page < totalPages) {
      setMeta((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const categories = [
    { id: "chairs", name: "Chairs", img: require("../assets/chair.png") },
    { id: "tables", name: "Tables", img: require("../assets/table.png") },
    { id: "sofas", name: "Sofas", img: require("../assets/sofa.png") },
    { id: "beds", name: "Beds", img: require("../assets/bed.png") },
    { id: "wardrobe", name: "Wardrobe", img: require("../assets/wardrope.png") },
  ];

  return (
    <div>
      <CategoryBar categories={categories} onCategoryClick={handleCategoryClick} />

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading products...</p>
      ) : (
        <ProductsGrid addToCart={addToCart} products={products} />
      )}

      {/* Pagination Controls */}
      <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
        <button
          onClick={handlePrev}
          disabled={meta.page === 1}
          style={{ marginRight: "1rem" }}
        >
          ◀ Prev
        </button>

        <span>
          Page {meta.page} of {Math.ceil(meta.total / meta.limit) || 1}
        </span>

        <button
          onClick={handleNext}
          disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
          style={{ marginLeft: "1rem" }}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

export default FurniturePage;
