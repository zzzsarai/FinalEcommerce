import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Footer from "../components/Footer";
import "../styles/Cart.css";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  // Fetch cart from backend on mount
  useEffect(() => {
    fetch("http://localhost:8082/api/cart")
      .then((res) => res.json())
      .then((data) => setCart(data))
      .catch((err) => console.error("Error fetching cart:", err));
  }, []);

  const updateCart = async (itemId, quantity) => {
    try {
      const response = await fetch(`http://localhost:8082/api/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) throw new Error("Failed to update cart");

      // Update local state
      setCart((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:8082/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove item");

      setCart((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error(err);
    }
  };

  const increaseQty = (id) => {
    const item = cart.find((i) => i.id === id);
    if (item) updateCart(id, item.quantity + 1);
  };

  const decreaseQty = (id) => {
    const item = cart.find((i) => i.id === id);
    if (item && item.quantity > 1) updateCart(id, item.quantity - 1);
    else if (item && item.quantity === 1) removeItem(id);
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <main className="cart-container">
        <h1 className="cart-title">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="cart-empty">Your cart is currently empty.</p>
        ) : (
          <>
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-price">₱{item.price}</p>
                </div>

                <div className="cart-item-controls">
                  <button
                    className="qty-btn"
                    onClick={() => decreaseQty(item.id)}
                  >
                    -
                  </button>
                  <span className="cart-quantity">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => increaseQty(item.id)}
                  >
                    +
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                    title="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}

            <h2 className="cart-total">Total: ₱{totalPrice}</h2>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Cart;
