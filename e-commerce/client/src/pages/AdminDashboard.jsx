import { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });

  const fetchProducts = async () => {
    const res = await axios.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);

    if (form.image) {
      formData.append("image", form.image);
    }

    if (editingId) {
      await axios.put(`/products/${editingId}`, formData);
      alert("Product Updated");
    } else {
      await axios.post("/products", formData);
      alert("Product Added");
    }

    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      image: null,
    });

    setEditingId(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: null,
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
  <>
    <Navbar />

    <div className="admin-page">
      <h2 className="admin-title">Admin Dashboard</h2>

      {/* FORM CARD */}
      <div className="admin-form-card">
        <h3>{editingId ? "Edit Product" : "Add Product"}</h3>

        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) =>
            setForm({ ...form, stock: e.target.value })
          }
        />

        <input
          type="file"
          onChange={(e) =>
            setForm({ ...form, image: e.target.files[0] })
          }
        />

        <button onClick={handleSubmit} className="admin-btn">
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </div>

      {/* PRODUCT LIST */}
      <div className="admin-product-list">
        <h3>All Products</h3>

        {products.map((product) => (
          <div key={product.id} className="admin-product-card">
            <div className="admin-product-info">
              <img
                src={`http://localhost:5000${product.image}`}
                alt=""
              />
              <div>
                <h4>{product.name}</h4>
                <p>₹ {product.price}</p>
                <p>Stock: {product.stock}</p>
              </div>
            </div>

            <div className="admin-actions">
              <button
                className="edit-btn"
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(product.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);};

export default AdminDashboard;