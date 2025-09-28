import React from "react";

function ProductsGrid({ products = [], addToCart }) {
  return (
    <section className="section bg-light">
      <div className="container">
        <h2 className="section-title">Our Products</h2>

        {products.length === 0 ? (
          <p style={{ textAlign: "center", padding: "2rem" }}>
            No products available.
          </p>
        ) : (
          <div className="grid">
            {products.map((product, i) => (
              <div className="card" key={product.id || i}>
                <div className="card-image">
                  <img
                    src={product.image_url || "/placeholder.png"} // ✅ fixed field
                    alt={product.name}
                    onError={(e) => (e.target.src = "/placeholder.png")} // fallback
                  />
                </div>
                <div className="card-body">
                  <h3>{product.name}</h3>
                  <p className="price">GHS {Number(product.price).toFixed(2)}</p>
                  {addToCart && (
                    <button
                      className="btn btn-primary"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductsGrid;
