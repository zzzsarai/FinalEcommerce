import React, { useEffect, useState } from "react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    image: null, // file
  });

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
    if (e.target.name === "image") {
      setNewProduct({ ...newProduct, image: e.target.files[0] });
    } else {
      setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    }
  };


  const handleFileChange = (e) => {
  setNewProduct({ ...newProduct, image: e.target.files[0] });
};

  const addProduct = async () => {
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("image", newProduct.image);

    try {
      await fetch(`${API}/products`, {
        method: "POST",
        body: formData, // Do NOT set headers manually
      });

      setNewProduct({
        name: "",
        description: "",
        price: 0,
        image: null,
      });

      fetchProducts();
    } catch (err) {
      console.error(err);
    }
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
      <h1>Manage Products</h1>

      {/* Add Product Form */}
      <div className="add-product">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newProduct.name}
          onChange={handleInput}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleInput}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleInput}
        />

        {/* Image File Upload */}
        <input type="file" name="image" onChange={handleFileChange} />


        <button onClick={addProduct}>Add Product</button>
      </div>

      {/* Product List */}
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <table style={{ width: "100%", marginTop: 20 }}>
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
                      width="50"
                    />
                  )}
                </td>
                <td>
                  <button onClick={() => deleteProduct(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
