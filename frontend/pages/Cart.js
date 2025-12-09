import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Footer from "../components/Footer";
import "../styles/Cart.css";
import { useNavigate } from "react-router-dom";

function Cart({ cart: parentCart, increaseQty, decreaseQty, removeItem }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  const API = "http://localhost:8082/api";

  // Fetch cart items on mount
  useEffect(() => {
    if (parentCart) {
      // Ensure all prices are numbers
      const formatted = parentCart.map((item) => ({
        ...item,
        price: Number(item.price) || 0,
      }));
      setCart(formatted);
    } else {
      fetchCart();
    }
  }, [parentCart]);

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API}/cart`);
      const data = await res.json();

      const formattedData = data.map((item) => ({
        ...item,
        price: Number(item.price) || 0, // ensure number
      }));

      setCart(formattedData);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  // Update cart quantity
  const updateCart = async (id, quantity) => {
    try {
      const res = await fetch(`${API}/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: data.quantity } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Remove cart item
  const removeCartItem = async (id) => {
    try {
      await fetch(`${API}/cart/${id}`, { method: "DELETE" });
      setCart((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Increase / Decrease quantity
  const handleIncrease = (id) => {
    const item = cart.find((i) => i.id === id);
    if (item) updateCart(id, item.quantity + 1);
  };

  const handleDecrease = (id) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    if (item.quantity === 1) removeCartItem(id);
    else updateCart(id, item.quantity - 1);
  };

  // Total price
  const totalPrice = cart.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
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
                <img
                  src={`http://localhost:8082/images/donuts/${item.image}`}
                  alt={item.product_name}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.product_name}</p>
                  <p className="cart-item-price">
                    ₱{Number(item.price).toFixed(2)}
                  </p>
                </div>

                <div className="cart-item-controls">
                  <button className="qty-btn" onClick={() => handleDecrease(item.id)}>
                    -
                  </button>
                  <span className="cart-quantity">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => handleIncrease(item.id)}>
                    +
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => removeCartItem(item.id)}
                    title="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}

            <h2 className="cart-total">Total: ₱{totalPrice.toFixed(2)}</h2>

            <button className="checkout-btn" onClick={() => navigate("/checkout")}>
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
