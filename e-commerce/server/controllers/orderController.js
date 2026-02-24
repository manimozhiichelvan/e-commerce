const db = require("../config/db");

exports.buyProduct = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({ message: "Product and quantity required" });
    }

    const [users] = await db.execute(
      "SELECT account_type FROM users WHERE id=?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const accountType = users[0].account_type;

    const [orders] = await db.execute(
      "SELECT COUNT(*) as total FROM orders WHERE user_id=?",
      [req.user.id]
    );

    const totalOrders = orders[0].total;

    if (accountType === "free" && totalOrders >= 2) {
      return res.status(403).json({ message: "Free account limit reached (2 orders)" });
    }

    if (accountType === "pro" && totalOrders >= 10) {
      return res.status(403).json({ message: "Pro account limit reached (10 orders)" });
    }

    await db.execute(
      "INSERT INTO orders (user_id, product_id, quantity) VALUES (?,?,?)",
      [req.user.id, product_id, quantity]
    );

    res.status(201).json({ message: "Order Placed Successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateDelivery = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status required" });
    }

    let statusCode = 0;

    if (status === "pending") statusCode = 0;
    if (status === "shipped") statusCode = 1;
    if (status === "delivered") statusCode = 2;

    await db.execute(
      "UPDATE orders SET delivery_status=?, status_code=? WHERE id=?",
      [status, statusCode, req.params.id]
    );

    res.json({ message: "Delivery Updated Successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT o.id, u.name AS user_name, p.name AS product_name,
             o.quantity, o.delivery_status, o.status_code, o.created_at
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN products p ON o.product_id = p.id
      ORDER BY o.created_at DESC
    `);

    res.json(orders);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};