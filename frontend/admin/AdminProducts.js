import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./admin-styles/products.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false); // new state

  const [productForm, setProductForm] = useState({
    id: null,
    name: "",
    description: "",
    price: 0,
    image: null,
    currentImage: null,
  });

  const [editing, setEditing] = useState(false);
  const API = "http://localhost:8082/api";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleInput = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProductForm({ ...productForm, image: e.target.files[0] });
  };

  const resetForm = () => {
    setEditing(false);
    setProductForm({
      id: null,
      name: "",
      description: "",
      price: 0,
      image: null,
      currentImage: null,
    });
  };

  const addProduct = async () => {
    setFormLoading(true);
    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("description", productForm.description);
    formData.append("price", productForm.price);
    if (productForm.image) formData.append("image", productForm.image);

    try {
      await fetch(`${API}/products`, { method: "POST", body: formData });
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
    setFormLoading(false);
  };

  const updateProduct = async () => {
    if (!productForm.id) return;
    setFormLoading(true);

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", productForm.name);
    formData.append("description", productForm.description);
    formData.append("price", productForm.price);
    if (productForm.image) formData.append("image", productForm.image);

    try {
      await fetch(`${API}/products/${productForm.id}`, {
        method: "POST",
        body: formData,
      });
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
    setFormLoading(false);
  };

  const editProduct = (product) => {
    setEditing(true);
    setProductForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: null,
      currentImage: product.image,
    });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await fetch(`${API}/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-products">
      <Link to="/admin" className="back-btn">←</Link>
      <h1>Manage Products</h1>

      <div className="products-container">
        {/* ===== Product Form ===== */}
        <div className="add-product">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={productForm.name}
              onChange={handleInput}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={productForm.description}
              onChange={handleInput}
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={productForm.price}
              onChange={handleInput}
            />
          </div>
          <div className="form-group">
            <input type="file" name="image" onChange={handleFileChange} />
            {editing && productForm.currentImage && !productForm.image && (
              <div className="image-preview">
                <p>Current Image:</p>
                <img
                  src={`http://localhost:8082/images/donuts/${productForm.currentImage}`}
                  alt="Current"
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            {editing ? (
              <>
                <button
                  className="btn update-btn"
                  onClick={updateProduct}
                  disabled={formLoading}
                >
                  {formLoading ? "Updating..." : "Update"}
                </button>
                <button className="btn cancel-btn" onClick={resetForm} disabled={formLoading}>
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="btn add-btn"
                onClick={addProduct}
                disabled={formLoading}
              >
                {formLoading ? "Adding Product..." : "Add Product"}
              </button>
            )}
          </div>
        </div>

        {/* ===== Products Table ===== */}
        <div className="products-table">
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.description}</td>
                    <td>₱{p.price}</td>
                    <td>
                      {p.image && (
                        <img
                          src={`http://localhost:8082/images/donuts/${p.image}`}
                          alt={p.name}
                        />
                      )}
                    </td>
                    <td>
                      <button className="edit-btn" onClick={() => editProduct(p)} disabled={formLoading}>
                        Edit
                      </button>
                      <button onClick={() => deleteProduct(p.id)} disabled={formLoading}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
