import { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products");
      setProducts(res.data);
    } catch (error) {
      alert("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product (simple JSON version)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/products", {
        name,
        description,
        price,
        stock,
        image,
      });

      alert("Product added successfully");

      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setImage("");

      fetchProducts();
    } catch (error) {
      alert("Product creation failed");
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/products/${id}`);
      alert("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      alert("Delete failed");
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>Admin Dashboard</h2>

        {/* Add Product Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <br /><br />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <br /><br />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <br /><br />

          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
          <br /><br />

          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
          <br /><br />

          <button type="submit">Add Product</button>
        </form>

        {/* Product List */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                width: "200px",
                textAlign: "center",
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
              <h4>{p.name}</h4>
              <p>₹ {p.price}</p>
              <p>Stock: {p.stock}</p>

              <button onClick={() => handleDelete(p.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;