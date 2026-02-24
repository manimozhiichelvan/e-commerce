const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/", verifyToken, async (req, res) => {
  try {
    const search = req.query.search || "";

    const [products] = await db.execute(
      "SELECT * FROM products WHERE name LIKE ?",
      [`%${search}%`]
    );

    res.json(products);

  } catch (error) {
    console.error("PRODUCT FETCH ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;