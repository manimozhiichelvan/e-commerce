import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const fetchProducts = async (query = "") => {
    try {
      const res = await axios.get(`/products?search=${query}`);
      setProducts(res.data);
    } catch (error) {
      console.log("Search error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts(search);
    }, 300); 

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleAddToCart = async (id) => {
    try {
      await axios.post("/cart/add", {
        product_id: id,
        quantity: 1,
      });
      alert("Added to cart successfully");
    } catch (error) {
      alert("Add to cart failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="products-container">

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="product-grid">
          {products.length === 0 ? (
            <h2>No Products Found</h2>
          ) : (
            products.map((p) => (
              <div key={p.id} className="product-card">

                <img
                  src={p.image}
                  alt={p.name}
                  onClick={() => navigate(`/product/${p.id}`)}
                  style={{ cursor: "pointer" }}
                />

                <h3
                  onClick={() => navigate(`/product/${p.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {p.name}
                </h3>

                <p>{p.description}</p>
                <p className="price">₹ {p.price}</p>
                <p>Stock: {p.stock}</p>

                {role !== "admin" && (
                  <button
                    disabled={p.stock === 0}
                    onClick={() => handleAddToCart(p.id)}
                  >
                    {p.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                )}

              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
};

export default Products;