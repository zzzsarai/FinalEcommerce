import React, { useState } from "react";
import "../styles/Checkout.css";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function Checkout({ cart, clearCart }) {
  const [customer, setCustomer] = useState({
    customer_name: "",
    address: "",
    contact_number: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // new state
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmOrder = async () => {
    if (!customer.customer_name || !customer.address || !customer.contact_number) {
      alert("Please fill in all your details.");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    setIsLoading(true); // start loading

    const orderData = {
      ...customer,
      payment_method: paymentMethod,
      total: totalPrice,
      items: cart.map((item) => ({
        product_id: item.product_id || item.id,
        quantity: item.quantity,
        price: Number(item.price),
      })),
    };

    try {
      // 1️⃣ Create order
      const response = await fetch("http://localhost:8082/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Checkout failed: ${data.message || "Unknown error"}`);
        setIsLoading(false);
        return;
      }

      // 2️⃣ Clear backend cart
      await fetch("http://localhost:8082/api/cart", { method: "DELETE" });

      // 3️⃣ Clear frontend cart
      clearCart();

      // 4️⃣ Show confirmation
      setIsConfirmed(true);
      setIsLoading(false);

      // Redirect after 5 seconds
      setTimeout(() => navigate("/"), 5000);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Checkout failed. Check console for details.");
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      {!isConfirmed ? (
        <main className="checkout-container">
          <h1 className="checkout-title">Checkout</h1>

          <div className="customer-info">
            <h2>Customer Details</h2>
            <label>
              Full Name
              <input
                type="text"
                name="customer_name"
                value={customer.customer_name}
                onChange={handleChange}
              />
            </label>
            <label>
              Address
              <input
                type="text"
                name="address"
                value={customer.address}
                onChange={handleChange}
              />
            </label>
            <label>
              Contact Number
              <input
                type="text"
                name="contact_number"
                value={customer.contact_number}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            {cart.length === 0 ? (
              <p>Cart is empty</p>
            ) : (
              <ul>
                {cart.map((item) => (
                  <li key={item.product_id || item.id}>
                    {item.product_name || item.name} x {item.quantity} = ₱
                    {(Number(item.price) * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            )}
            <h3>Total: ₱{totalPrice.toFixed(2)}</h3>
          </div>

          <div className="payment-method">
            <h2>Payment Method</h2>
            <label>
              <input
                type="radio"
                value="GCash"
                checked={paymentMethod === "GCash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              GCash
            </label>
            <label>
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
          </div>

          <div className="checkout-actions">
            <button
              className="confirm-btn"
              onClick={handleConfirmOrder}
              disabled={cart.length === 0 || isLoading}
            >
              {isLoading ? "Confirming..." : "Confirm Order"}
            </button>
            <button className="cancel-btn" onClick={() => navigate("/cart")}>
              Cancel
            </button>
          </div>
        </main>
      ) : (
        <div className="order-confirmed">
          <h2>✅ Order Confirmed!</h2>
          <p>Thank you {customer.customer_name}! Your order has been placed.</p>
          <p>Redirecting to homepage...</p>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Checkout;
