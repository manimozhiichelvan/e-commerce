const db = require("../config/db");

exports.checkOrderLimit = async (req, res, next) => {
  const [users] = await db.execute(
    "SELECT account_type FROM users WHERE id=?",
    [req.user.id]
  );

  const accountType = users[0].account_type;

  const [orders] = await db.execute(
    "SELECT COUNT(*) as total FROM orders WHERE user_id=?",
    [req.user.id]
  );

  const totalOrders = orders[0].total;

  if (accountType === "free" && totalOrders >= 2)
    return res.status(403).json({ message: "Free account limit reached" });

  if (accountType === "pro" && totalOrders >= 10)
    return res.status(403).json({ message: "Pro account limit reached" });

  next();
};