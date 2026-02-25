const express = require("express");
const router = express.Router();

const {
  buyProduct,
  getUserOrders,
  getAllOrders,
  updateDeliveryStatus
} = require("../controllers/orderController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");


router.post("/buy", verifyToken, buyProduct);
router.get("/my-orders", verifyToken, getUserOrders);


router.get("/", verifyToken, isAdmin, getAllOrders);
router.put("/delivery/:id", verifyToken, isAdmin, updateDeliveryStatus);

module.exports = router;