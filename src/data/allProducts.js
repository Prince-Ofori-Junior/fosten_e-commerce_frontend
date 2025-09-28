useEffect(() => {
  const fetchProducts = async () => {
    try {
      let url = "http://localhost:8000/api/products";

      // ✅ add type filter dynamically if needed
      if (selectedType) {
        url += `?type=${encodeURIComponent(selectedType)}`;
      }

      const res = await fetch(url);
      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        setProducts(result.data);
      } else if (Array.isArray(result)) {
        setProducts(result);
      } else {
        console.warn("Unexpected API response:", result);
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    }
  };

  fetchProducts();
}, [selectedType]); // 🔄 refetch when type changes
