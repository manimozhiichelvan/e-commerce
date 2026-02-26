const db = require("../config/db");

exports.addToCart = async (req, res) => {
  try {
    const user_id = req.user.id;
    const account_type = req.user.account_type;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({ message: "Invalid data" });
    }


    const [product] = await db.execute(
      "SELECT stock FROM products WHERE id = ?",
      [product_id]
    );

    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product[0].stock < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    const [cartItems] = await db.execute(
      "SELECT COUNT(*) as count FROM cart WHERE user_id = ?",
      [user_id]
    );

    const currentCount = cartItems[0].count;

    if (account_type === "free" && currentCount >= 2) {
      return res
        .status(403)
        .json({ message: "Free plan allows only 2 items in cart" });
    }

    if (account_type === "pro" && currentCount >= 5) {
      return res
        .status(403)
        .json({ message: "Pro plan allows only 5 items in cart" });
    }

    const [existing] = await db.execute(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );

    if (existing.length > 0) {

      await db.execute(
        "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
        [quantity, user_id, product_id]
      );
    } else {
      await db.execute(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [user_id, product_id, quantity]
      );
    }

    res.json({ message: "Added to Cart Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};
exports.getCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [rows] = await db.execute(
      `SELECT 
         cart.id,
         products.name,
         products.image,
         products.price,
         products.stock,
         cart.quantity
       FROM cart
       JOIN products ON cart.product_id = products.id
       WHERE cart.user_id = ?`,
      [user_id]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};