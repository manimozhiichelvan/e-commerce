import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`/products`)
      .then((res) => {
        const found = res.data.find((p) => p.id == id);
        setProduct(found);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const buyNow = async () => {
    try {
      await axios.post("/cart/add", {
        product_id: product.id,
        quantity: 1,
      });

      await axios.post("/cart/checkout");

      alert("Product Purchased Successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Purchase Failed");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="details-page">
        <div className="details-container">
          <div className="details-image">
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
            />
          </div>
          <div className="details-info">
            <h2>{product.name}</h2>

            <div className="details-price">
              ₹ {product.price}
            </div>

            <div
              className={`stock-badge ${
                product.stock > 0 ? "in-stock" : "out-stock"
              }`}
            >
              {product.stock > 0
                ? `In Stock (${product.stock})`
                : "Out of Stock"}
            </div>

            <div className="buy-box">
              <h3>Buy Now</h3>

              <button
                disabled={product.stock === 0}
                onClick={buyNow}
              >
                Buy Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ProductDetails;