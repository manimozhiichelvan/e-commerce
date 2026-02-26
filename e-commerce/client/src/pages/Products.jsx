import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Fetch products with live search
  useEffect(() => {
    const delay = setTimeout(() => {
      axios
        .get(`/products?search=${search}`)
        .then((res) => setProducts(res.data))
        .catch((err) => console.log(err));
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  // Add to cart
  const addToCart = async (e, id) => {
    e.stopPropagation(); // Prevent card click redirect

    try {
      await axios.post("/cart/add", {
        product_id: id,
        quantity: 1,
      });

      alert("Added to Cart");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding to cart");
    }
  };

  return (
    <>
      <Navbar />

      <div className="products-page">
        {/* Centered Search */}
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search for products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Product Grid */}
        <div className="products-container">
          {products.length === 0 && (
            <p style={{ textAlign: "center" }}>No products found</p>
          )}

          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {/* Image */}
              <div className="image-wrapper">
                <img src={product.image} alt={product.name} />
              </div>

              {/* Info */}
              <div className="product-info">
                <h3>{product.name}</h3>

                <p className="price">₹ {product.price}</p>

                <p
                  className={`stock ${
                    product.stock > 0 ? "in-stock" : "out-stock"
                  }`}
                >
                  {product.stock > 0
                    ? `In Stock (${product.stock})`
                    : "Out of Stock"}
                </p>

                <button
                  disabled={product.stock === 0}
                  onClick={(e) => addToCart(e, product.id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Products;