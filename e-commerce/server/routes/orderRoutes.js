const express = require("express");
const router = express.Router();

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const {
  buyProduct,
  updateDelivery,
  getAllOrders
} = require("../controllers/orderController");

router.post("/buy", verifyToken, buyProduct);


router.put("/delivery/:id", verifyToken, isAdmin, updateDelivery);
router.get("/", verifyToken, isAdmin, getAllOrders);

module.exports = router;