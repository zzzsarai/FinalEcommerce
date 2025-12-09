import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./admin-styles/orders.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = "http://localhost:8082/api";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API}/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-orders">
      <Link to="/admin" className="back-btn">←</Link>
      <h1>Orders</h1>

      <div className="orders-container">
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Items</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className={o.status === "completed" ? "completed" : ""}>
                  <td>{o.id}</td>
                  <td>{o.customer_name || "Guest"}</td>
                  <td>₱{Number(o.total).toFixed(2)}</td>
                  <td>{o.status}</td>
                  <td>
                    {o.items?.map((i) => (
                      <div key={i.id}>
                        {i.quantity} x {i.product?.name || i.product_id}
                      </div>
                    ))}
                  </td>
                  <td>
                    {o.status !== "completed" && (
                      <button
                        className="action-btn"
                        onClick={() => updateStatus(o.id, "completed")}
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
