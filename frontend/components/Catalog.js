import { useState } from "react";
import "../styles/Catalog.css";
import "../styles/DonutCard.css";

function Catalog({ products, searchQuery, addToCart }) {
  const [addedIds, setAddedIds] = useState([]); // track which donuts were just added

  const handleAdd = (product) => {
    addToCart(product);
    setAddedIds((prev) => [...prev, product.id]);

    // revert button text after 2 seconds
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 2000);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="catalog-container">
      {filteredProducts.length > 0 ? (
        <div className="cards">
          {filteredProducts.map((product) => (
            <div key={product.id} className="donut-card">
              <img
                src={`http://localhost:8082/images/donuts/${product.image}`}
                alt={product.name}
                className="donut-image"
              />
              <h3 className="donut-name">{product.name}</h3>
              <p className="donut-description">{product.description}</p>
              <p className="donut-price">₱{product.price}</p>
              <button
                className="add-to-cart"
                onClick={() => handleAdd(product)}
              >
                {addedIds.includes(product.id) ? "Added ✓" : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-results">No products found for "{searchQuery}"</p>
      )}
    </div>
  );
}

export default Catalog;
