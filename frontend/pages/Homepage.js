import React, { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import DonutBanner from "../components/DonutBanner";
import SearchBar from "../components/SearchBar";
import Catalog from "../components/Catalog";
import Footer from "../components/Footer";

function Homepage({ addToCart }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSearch = (query) => setSearchQuery(query);

  useEffect(() => {
    // Fetch products from Laravel API
    fetch("http://localhost:8082/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <DonutBanner />

      <div className="p-4 flex justify-center">
        <SearchBar onSearch={handleSearch} />
      </div>

      {searchQuery && (
        <p
          style={{ textAlign: "center", color: "#4b5563", marginBottom: "1rem" }}
        >
          You searched for: <strong>{searchQuery}</strong>
        </p>
      )}

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading products...</p>
      ) : (
        <Catalog
          products={products}
          searchQuery={searchQuery}
          addToCart={addToCart}
        />
      )}

      <Footer />
    </div>
  );
}

export default Homepage;
