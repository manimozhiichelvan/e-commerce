const db = require("../config/db");

exports.checkout = async (req, res) => {
  try {
    const user_id = req.user.id;
    const account_type = req.user.account_type;

    const [cartItems] = await db.execute(
      `SELECT 
         cart.product_id,
         cart.quantity,
         products.price,
         products.stock
       FROM cart
       JOIN products ON cart.product_id = products.id
       WHERE cart.user_id = ?`,
      [user_id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;

    for (let item of cartItems) {
      if (item.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for product ID ${item.product_id}`,
        });
      }

      total += item.price * item.quantity;
    }

    let discountPercent = 0;

    if (account_type === "pro") discountPercent = 5;
    if (account_type === "premium") discountPercent = 10;

    const discountAmount = (total * discountPercent) / 100;
    const finalAmount = total - discountAmount;

    for (let item of cartItems) {
      await db.execute(
        `INSERT INTO orders 
         (user_id, product_id, quantity, delivery_status) 
         VALUES (?, ?, ?, ?)`,
        [user_id, item.product_id, item.quantity, "pending"]
      );

      await db.execute(
        "UPDATE products SET stock = stock - ? WHERE id = ?",
        [item.quantity, item.product_id]
      );
    }

    await db.execute("DELETE FROM cart WHERE user_id = ?", [user_id]);

    res.json({
      message: "Order Placed Successfully",
      originalTotal: total,
      discountApplied: `${discountPercent}%`,
      finalAmount: finalAmount,
      delivery:
        account_type === "free"
          ? "Standard Delivery (Paid)"
          : "Free Delivery",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Checkout Failed" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [orders] = await db.execute(
      `SELECT 
          orders.id,
          products.name,
          products.image,
          products.price,
          orders.quantity,
          orders.delivery_status,
          orders.created_at
       FROM orders
       JOIN products ON orders.product_id = products.id
       WHERE orders.user_id = ?
       ORDER BY orders.created_at DESC`,
      [user_id]
    );

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};