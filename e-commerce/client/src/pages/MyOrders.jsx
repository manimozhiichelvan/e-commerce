import { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/orders/my-orders");
      setOrders(res.data);
    } catch (error) {
      alert("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />

      <div className="orders-container">
        <h2>My Orders</h2>

        {orders.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Delivery Status</th>
                <th>Status Code</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.product_name}</td>
                  <td>{o.quantity}</td>
                  <td className={`status ${o.delivery_status}`}>
                    {o.delivery_status}
                  </td>
                  <td>{o.status_code}</td>
                  <td>{new Date(o.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default MyOrders;