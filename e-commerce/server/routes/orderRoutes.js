const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { getMyOrders } = require("../controllers/orderController");

router.get("/my-orders", verifyToken, getMyOrders);

module.exports = router;