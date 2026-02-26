const db = require("../config/db");

exports.getProducts = async (req, res) => {
  const { search } = req.query;

  let query = "SELECT * FROM products";
  let values = [];

  if (search) {
    query += " WHERE name LIKE ? OR description LIKE ?";
    values.push(`%${search}%`, `%${search}%`);
  }

  const [rows] = await db.execute(query, values);
  res.json(rows);
};

exports.createProduct = async (req, res) => {
  const { name, description, price, stock, image } = req.body;

  await db.execute(
    "INSERT INTO products (name, description, price, stock, image) VALUES (?, ?, ?, ?, ?)",
    [name, description, price, stock, image]
  );

  res.json({ message: "Product Created Successfully" });
};

exports.deleteProduct = async (req, res) => {
  await db.execute("DELETE FROM products WHERE id=?", [req.params.id]);
  res.json({ message: "Product Deleted Successfully" });
};