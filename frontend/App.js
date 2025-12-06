import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import Navigation from "./components/Navigation";

import "./styles/App.css";

function App() {
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  // Fetch cart from backend
  useEffect(() => {
    fetch("http://localhost:8082/api/cart")
      .then((res) => res.json())
      .then((data) => setCart(data))
      .catch((err) => console.error(err));
  }, []);

  const addToCart = async (donut) => {
    try {
      const res = await fetch("http://localhost:8082/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...donut, quantity: 1 }),
      });
      const data = await res.json();
      showToast(`${donut.name} added to cart!`);

      setCart((prevCart) => {
        const existing = prevCart.find((item) => item.id === data.id);
        if (existing) {
          return prevCart.map((item) =>
            item.id === data.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prevCart, data];
      });
    } catch (err) {
      console.error(err);
    }
  };

  const increaseQty = async (id) => {
    const item = cart.find((c) => c.id === id);
    if (!item) return;

    try {
      const res = await fetch(`http://localhost:8082/api/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: item.quantity + 1 }),
      });
      const data = await res.json();

      setCart((prevCart) =>
        prevCart.map((c) => (c.id === id ? { ...c, quantity: data.quantity } : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const decreaseQty = async (id) => {
    const item = cart.find((c) => c.id === id);
    if (!item) return;

    if (item.quantity === 1) return removeItem(id);

    try {
      const res = await fetch(`http://localhost:8082/api/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: item.quantity - 1 }),
      });
      const data = await res.json();

      setCart((prevCart) =>
        prevCart.map((c) => (c.id === id ? { ...c, quantity: data.quantity } : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (id) => {
    try {
      await fetch(`http://localhost:8082/api/cart/${id}`, { method: "DELETE" });
      setCart((prevCart) => prevCart.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Router>
      <Navigation cartCount={cart.length} />
      <Routes>
        <Route path="/" element={<Homepage addToCart={addToCart} />} />
        <Route
          path="/checkout"
          element={<Checkout cart={cart} clearCart={() => setCart([])} />}
        />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              increaseQty={increaseQty}
              decreaseQty={decreaseQty}
              removeItem={removeItem}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
