import { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/Cart.css";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    axios.get("/cart").then((res) => setItems(res.data));
  }, []);

  const checkout = async () => {
    const res = await axios.post("/cart/checkout");
    setSummary(res.data);
    alert("Order Placed Successfully");
  };

  return (
    <>
      <Navbar />

      <div className="cart-container">
        <div className="cart-left">
          <h2>Shopping Cart</h2>

          {items.map((item) => (
            <div key={item.id} className="cart-card">
              <img src={item.image} alt={item.name} />

              <div className="cart-info">
                <h3>{item.name}</h3>
                <p className="price">₹ {item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <p className="stock">
                  In Stock: {item.stock ?? "Available"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <button onClick={checkout}>Proceed to Checkout</button>

          {summary && (
            <div className="summary-box">
              <p>Original: ₹{summary.originalTotal}</p>
              <p>Discount: {summary.discountApplied}</p>
              <h3>Total: ₹{summary.finalAmount}</h3>
              <p>{summary.delivery}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;