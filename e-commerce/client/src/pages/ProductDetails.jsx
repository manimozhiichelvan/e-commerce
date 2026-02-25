import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const fetchProduct = async () => {
    const res = await axios.get(`/products/${id}`);
    setProduct(res.data);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleBuy = async () => {
    try {
      await axios.post("/orders/buy", {
        product_id: id,
        quantity: 1,
      });
      alert("Order placed successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Purchase failed");
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="details-container">
        <div className="details-card">
          <img src={product.image} alt={product.name} />

          <div className="details-info">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <h3>₹ {product.price}</h3>
            <p>Stock: {product.stock}</p>

            <button
              disabled={product.stock === 0}
              onClick={handleBuy}
            >
              {product.stock > 0 ? "Buy Now" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;