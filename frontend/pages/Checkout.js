import React, { useState } from "react";
import "../styles/Checkout.css";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function Checkout({ cart, clearCart }) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [customer, setCustomer] = useState({
    fullName: "",
    address: "",
    contactNumber: "",
  });
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmOrder = async () => {
    if (!customer.fullName || !customer.address || !customer.contactNumber) {
      alert("Please fill in all your details before confirming your order.");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    try {
      // Send order to backend
      const response = await fetch("http://localhost:8082/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customer.fullName,
          address: customer.address,
          contact_number: customer.contactNumber,
          payment_method: paymentMethod,
          total: totalPrice,
          items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to place order");

      const data = await response.json();
      console.log("Order success:", data);

      setIsConfirmed(true);
      clearCart();

      setTimeout(() => navigate("/"), 5000);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleCancel = () => navigate("/cart");

  return (
    <div className="checkout-page">
      {!isConfirmed ? (
        <main className="checkout-container">
          <h1 className="checkout-title">Checkout</h1>

          {/* Customer Information */}
          <section className="customer-info">
            <h2>Customer Details</h2>
            <form>
              <label>
                Full Name:
                <input
                  type="text"
                  name="fullName"
                  value={customer.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </label>

              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={customer.address}
                  onChange={handleChange}
                  placeholder="Enter your complete address"
                  required
                />
              </label>

              <label>
                Contact Number:
                <input
                  type="text"
                  name="contactNumber"
                  value={customer.contactNumber}
                  onChange={handleChange}
                  placeholder="Enter your contact number"
                  required
                />
              </label>
            </form>
          </section>

          {/* Order Summary */}
          <section className="order-summary">
            <h2>Order Summary</h2>
            {cart.length > 0 ? (
              <>
                <ul>
                  {cart.map((item) => (
                    <li key={item.id}>
                      {item.name} x {item.quantity}
                      <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <h3>Total: ₱{totalPrice.toFixed(2)}</h3>
              </>
            ) : (
              <p>Your cart is empty.</p>
            )}
          </section>

          {/* Payment Method */}
          <section className="payment-method">
            <h2>Payment Method</h2>
            <label>
              <input
                type="radio"
                name="payment"
                value="GCash"
                checked={paymentMethod === "GCash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              GCash
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
          </section>

          {/* Buttons */}
          <div className="checkout-actions">
            <button
              className="confirm-btn"
              onClick={handleConfirmOrder}
              disabled={cart.length === 0}
            >
              Confirm Order
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </main>
      ) : (
        <div className="order-confirmed">
          <h2>✅ Order Confirmed!</h2>
          <p>
            Thank you, <strong>{customer.fullName}</strong>! Your order has been
            placed successfully.
          </p>
          <p>
            Have a <span className="brand-name">Glazy Day!</span>
          </p>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Checkout;
