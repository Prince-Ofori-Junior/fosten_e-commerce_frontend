useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/products?type=furniture");
      const result = await res.json();

      // ✅ Support both { success, data } and raw array []
      if (result.success && Array.isArray(result.data)) {
        setProducts(result.data);
      } else if (Array.isArray(result)) {
        setProducts(result);
      } else {
        console.warn("Unexpected API response:", result);
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to fetch furniture products:", err);
      setProducts([]);
    }
  };

  fetchProducts();
}, []);
