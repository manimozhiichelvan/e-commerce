const db = require("../config/db");

exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;

    await db.execute(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
      [user_id, product_id, quantity]
    );

    res.json({ message: "Added to cart successfully" });
  } catch (error) {
    res.status(500).json({ message: "Add to cart failed" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [rows] = await db.execute(
      `SELECT cart.id, products.name, products.price, products.image, cart.quantity
       FROM cart
       JOIN products ON cart.product_id = products.id
       WHERE cart.user_id = ?`,
      [user_id]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

exports.checkout = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [cartItems] = await db.execute(
      "SELECT * FROM cart WHERE user_id=?",
      [user_id]
    );

    for (let item of cartItems) {
      await db.execute(
        "INSERT INTO orders (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [user_id, item.product_id, item.quantity]
      );

      await db.execute(
        "UPDATE products SET stock = stock - ? WHERE id=?",
        [item.quantity, item.product_id]
      );
    }

    await db.execute("DELETE FROM cart WHERE user_id=?", [user_id]);

    res.json({ message: "Order placed successfully" });

  } catch (error) {
    res.status(500).json({ message: "Checkout failed" });
  }
};