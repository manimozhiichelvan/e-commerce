import { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/orders/my-orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Navbar />

      <div className="orders-page">
        <h2>My Orders</h2>

        {orders.length === 0 && (
          <p>No orders placed yet.</p>
        )}

        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <img src={order.image} alt={order.name} />

            <div className="order-info">
              <h3>{order.name}</h3>
              <p>Price: ₹ {order.price}</p>
              <p>Quantity: {order.quantity}</p>
              <p className="status">
                Status: {order.delivery_status}
              </p>
              <p className="date">
                Ordered on: {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MyOrders;