const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");

const {
  addToCart,
  getCart,
  checkout
} = require("../controllers/cartController");

router.post("/add", verifyToken, addToCart);
router.get("/", verifyToken, getCart);
router.post("/checkout", verifyToken, checkout);

module.exports = router;