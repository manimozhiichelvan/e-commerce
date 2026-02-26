const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {
  addToCart,
  getCart,
} = require("../controllers/cartController");

const {
  checkout,
} = require("../controllers/orderController");


router.post("/add", verifyToken, addToCart);

router.get("/", verifyToken, getCart);

router.post("/checkout", verifyToken, checkout);

module.exports = router;