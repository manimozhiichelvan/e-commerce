import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/products?search=${search}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, [search]);

  const addToCart = async (e, id) => {
    e.stopPropagation();

    try {
      await axios.post("/cart/add", {
        product_id: id,
        quantity: 1,
      });

      alert("Added to Cart");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <>
      <Navbar />

      <div className="products-page">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="products-container">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="image-wrapper">
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                />
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">₹ {product.price}</p>

                <p className="stock">
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