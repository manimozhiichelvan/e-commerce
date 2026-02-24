import { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (searchQuery = "") => {
    try {
      setLoading(true);

      const res = await axios.get(
        `/products?search=${searchQuery}`
      );

      setProducts(res.data);
      setLoading(false);

    } catch (error) {
      console.error("Product Fetch Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  const handleBuy = async (productId) => {
    try {
      await axios.post("/orders/buy", {
        product_id: productId,
        quantity: 1,
      });

      alert("Order placed successfully!");

    } catch (error) {
      alert(error.response?.data?.message || "Purchase failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="products-container">

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {loading && (
          <h2 className="status-text">Loading products...</h2>
        )}

        {!loading && products.length === 0 && (
          <h2 className="status-text">
            No products found
          </h2>
        )}

        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">

              <img
                src={
                  product.image
                    ? product.image
                    : "https://via.placeholder.com/250"
                }
                alt={product.name}
              />

              <h3>{product.name}</h3>

              <p className="description">
                {product.description}
              </p>

              <p className="price">
                ₹ {product.price}
              </p>

              <p className="stock">
                {product.stock > 0
                  ? `In Stock (${product.stock})`
                  : "Out of Stock"}
              </p>

  
              <button
                className="buy-btn"
                disabled={product.stock === 0}
                onClick={() => handleBuy(product.id)}
              >
                {product.stock > 0
                  ? "Add to Cart"
                  : "Unavailable"}
              </button>

            </div>
          ))}
        </div>

      </div>
    </>
  );
};

export default Products;