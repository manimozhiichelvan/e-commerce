const db = require("../config/db");


exports.buyProduct = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;
    const account_type = req.user.account_type;

    if (!product_id || !quantity) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (account_type === "free" && quantity > 2) {
      return res.status(403).json({
        message: "Free users can buy maximum 2 items per order"
      });
    }

    if (account_type === "pro" && quantity > 5) {
      return res.status(403).json({
        message: "Pro users can buy maximum 5 items per order"
      });
    }

    const [product] = await db.execute(
      "SELECT * FROM products WHERE id=?",
      [product_id]
    );

    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product[0].stock < quantity) {
      return res.status(400).json({ message: "Out of stock" });
    }

    await db.execute(
      "INSERT INTO orders (user_id, product_id, quantity, delivery_status, status_code) VALUES (?, ?, ?, 'pending', 0)",
      [user_id, product_id, quantity]
    );

    await db.execute(
      "UPDATE products SET stock = stock - ? WHERE id=?",
      [quantity, product_id]
    );

    res.json({ message: "Order placed successfully" });

  } catch (error) {
    console.error("BUY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.getUserOrders = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [orders] = await db.execute(`
      SELECT 
        orders.id,
        products.name AS product_name,
        orders.quantity,
        orders.delivery_status,
        orders.status_code,
        orders.created_at
      FROM orders
      JOIN products ON orders.product_id = products.id
      WHERE orders.user_id = ?
    `, [user_id]);

    res.json(orders);

  } catch (error) {
    console.error("USER ORDERS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT 
        orders.id,
        users.name AS user_name,
        products.name AS product_name,
        orders.quantity,
        orders.delivery_status,
        orders.status_code,
        orders.created_at
      FROM orders
      JOIN users ON orders.user_id = users.id
      JOIN products ON orders.product_id = products.id
    `);

    res.json(orders);

  } catch (error) {
    console.error("ADMIN ORDERS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.updateDeliveryStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    let statusCode = 0;

    if (status === "pending") statusCode = 0;
    if (status === "shipped") statusCode = 1;
    if (status === "delivered") statusCode = 2;

    await db.execute(
      "UPDATE orders SET delivery_status=?, status_code=? WHERE id=?",
      [status, statusCode, orderId]
    );

    res.json({ message: "Delivery status updated" });

  } catch (error) {
    console.error("UPDATE DELIVERY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.checkout = async (req, res) => {
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
};