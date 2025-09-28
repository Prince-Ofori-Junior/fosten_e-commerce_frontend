import React, { useState, useEffect } from "react";
import ProductsGrid from "../components/ProductsGrid";

function ProductPage({ addToCart, searchTerm }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Build query string dynamically
        let url = "http://localhost:8000/api/products";
        if (searchTerm) {
          url += `?search=${encodeURIComponent(searchTerm)}`;
        }

        const res = await fetch(url);
        const result = await res.json();

        if (result.success && result.data) {
          setProducts(result.data.rows || []); // ✅ extract rows only
          setMeta({
            total: result.data.total,
            page: result.data.page,
            limit: result.data.limit,
          });
        } else {
          console.error("Error fetching products:", result.message);
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm]); // ✅ refetch whenever searchTerm changes

  if (loading) return <p>Loading products...</p>;

  if (!products.length) return <p>No products found.</p>;

  return (
    <div>
      <ProductsGrid addToCart={addToCart} products={products} />

      {/* Example: Pagination info */}
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <p>
          Showing page {meta.page} of {Math.ceil(meta.total / meta.limit) || 1}
        </p>
      </div>
    </div>
  );
}

export default ProductPage;
