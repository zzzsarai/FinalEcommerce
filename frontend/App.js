import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import Navigation from "./components/Navigation";
import AdminDashboard from "./admin/AdminDashboard";
import AdminOrders from "./admin/AdminOrders";
import AdminProducts from "./admin/AdminProducts";

import "./styles/App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");

  const API = "http://localhost:8082/api";

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  // Fetch catalog products
  useEffect(() => {
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch cart from backend
  useEffect(() => {
    fetch(`${API}/cart`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => ({
          ...item,
          price: Number(item.price),
        }));
        setCart(formatted);
      })
      .catch((err) => console.error(err));
  }, []);

  // Add to cart
  const addToCart = async (product) => {
    try {
      const cartItem = {
        product_id: product.id,
        product_name: product.name,
        price: Number(product.price),
        quantity: 1,
        image: product.image,
      };

      const res = await fetch(`${API}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem),
      });

      if (!res.ok) throw new Error("Failed to add to cart");
      const data = await res.json();

      setCart((prev) => {
        const existing = prev.find((item) => item.product_id === data.product_id);
        if (existing) {
          return prev.map((item) =>
            item.product_id === data.product_id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...data, price: Number(data.price) }];
      });

      showToast(`${product.name} added to cart`);
    } catch (err) {
      console.error(err);
    }
  };

  // Increase / Decrease / Remove
  const updateCartItem = async (id, quantity) => {
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
  };

  const removeCartItem = async (id) => {
    await fetch(`${API}/cart/${id}`, { method: "DELETE" });
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear cart (frontend + backend)
  const clearCart = async () => {
    await fetch(`${API}/cart`, { method: "DELETE" });
    setCart([]);
  };

  return (
    <Router>
      <Navigation cartCount={cart.length} />
      {toast && <div className="toast">{toast}</div>}

      <Routes>
        <Route
          path="/"
          element={<Homepage products={products} addToCart={addToCart} />}
        />
        <Route
          path="/checkout"
          element={<Checkout cart={cart} clearCart={clearCart} />}
        />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              increaseQty={(id) => {
                const item = cart.find((i) => i.id === id);
                if (item) updateCartItem(id, item.quantity + 1);
              }}
              decreaseQty={(id) => {
                const item = cart.find((i) => i.id === id);
                if (item) {
                  if (item.quantity === 1) removeCartItem(id);
                  else updateCartItem(id, item.quantity - 1);
                }
              }}
              removeItem={removeCartItem}
            />
          }
        />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/products" element={<AdminProducts />} />
      </Routes>
    </Router>
  );
}

export default App;
