const db = require("../config/db");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    await db.execute(
      "INSERT INTO products (name, description, price, stock, created_by) VALUES (?,?,?,?,?)",
      [name, description, price, stock, req.user.id]
    );

    res.status(201).json({ message: "Product Created Successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const search = req.query.search || "";

    const [products] = await db.execute(
      "SELECT * FROM products WHERE name LIKE ?",
      [`%${search}%`]
    );

    res.json(products);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    await db.execute(
      "UPDATE products SET name=?, description=?, price=?, stock=? WHERE id=?",
      [name, description, price, stock, req.params.id]
    );

    res.json({ message: "Product Updated Successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await db.execute(
      "DELETE FROM products WHERE id=?",
      [req.params.id]
    );

    res.json({ message: "Product Deleted Successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};