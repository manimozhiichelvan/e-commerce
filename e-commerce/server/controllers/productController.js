const db = require("../config/db");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    await db.execute(
      "INSERT INTO products (name, description, price, stock, image) VALUES (?, ?, ?, ?, ?)",
      [name, description, price, stock, imagePath]
    );

    res.json({ message: "Product Created Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Product Creation Failed" });
  }
};

exports.getProducts = async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM products");
  res.json(rows);
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  await db.execute("DELETE FROM products WHERE id=?", [id]);

  res.json({ message: "Product Deleted" });
};
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    let imagePath = null;

    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    if (imagePath) {
      await db.execute(
        "UPDATE products SET name=?, description=?, price=?, stock=?, image=? WHERE id=?",
        [name, description, price, stock, imagePath, id]
      );
    } else {
      await db.execute(
        "UPDATE products SET name=?, description=?, price=?, stock=? WHERE id=?",
        [name, description, price, stock, id]
      );
    }

    res.json({ message: "Product Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Update Failed" });
  }
};