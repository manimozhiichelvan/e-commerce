const db = require("../config/db");

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM products");
    res.json(rows);
  } catch {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Create product (image is URL string)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image } = req.body;

    await db.execute(
      "INSERT INTO products (name, description, price, stock, image) VALUES (?, ?, ?, ?, ?)",
      [name, description, price, stock, image]
    );

    res.json({ message: "Product created successfully" });
  } catch {
    res.status(500).json({ message: "Product creation failed" });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute("DELETE FROM products WHERE id=?", [id]);

    res.json({ message: "Product deleted successfully" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};