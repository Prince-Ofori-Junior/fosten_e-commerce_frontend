import React from "react";

function ProductsGrid({ products = [], addToCart, lastProductRef }) {
  return (
    <section className="section bg-light">
      <div className="container">
        <h2 className="section-title">Our Products</h2>

        {products.length === 0 ? (
          <p style={{ textAlign: "center", padding: "2rem" }}>No products available.</p>
        ) : (
          <div className="grid">
            {products.map((product, i) => {
              const isLast = i === products.length - 1; // check if last product
              return (
                <div
                  className="card"
                  key={product.id || i}
                  ref={isLast ? lastProductRef : null} // attach ref to last item
                >
                  <div className="card-image">
                    <img
                      src={product.image_url || "/placeholder.png"}
                      alt={product.name}
                      onError={(e) => (e.target.src = "/placeholder.png")}
                    />
                  </div>
                  <div className="card-body">
                    <h3>{product.name}</h3>
                    <p className="price">GHS {Number(product.price).toFixed(2)}</p>
                    {addToCart && (
                      <button className="btn btn-primary" onClick={() => addToCart(product)}>
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductsGrid;
