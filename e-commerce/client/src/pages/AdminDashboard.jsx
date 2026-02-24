import { useEffect, useState } from "react";
import axios from "../api/axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axios.get("/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`/orders/delivery/${id}`, { status });
    fetchOrders();
  };

  return (
    <div className="admin-page">
      <h2>Admin Dashboard</h2>

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Product</th>
            <th>Status</th>
            <th>Code</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.user_name}</td>
              <td>{o.product_name}</td>
              <td>{o.delivery_status}</td>
              <td>{o.status_code}</td>
              <td>
                <button onClick={() => updateStatus(o.id, "shipped")}>
                  Ship
                </button>
                <button onClick={() => updateStatus(o.id, "delivered")}>
                  Deliver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;