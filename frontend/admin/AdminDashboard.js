import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const API = "http://localhost:8082/api";

  useEffect(() => {
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => setProductsCount(data.length))
      .catch(console.error);

    fetch(`${API}/orders`)
      .then((res) => res.json())
      .then((data) => setOrdersCount(data.length))
      .catch(console.error);
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div style={{ display: "flex", gap: 20 }}>
        <div className="card">
          <h2>Products</h2>
          <p>{productsCount}</p>
          <Link to="/admin/products">Manage Products</Link>
        </div>
        <div className="card">
          <h2>Orders</h2>
          <p>{ordersCount}</p>
          <Link to="/admin/orders">View Orders</Link>
        </div>
      </div>
    </div>
  );
}
