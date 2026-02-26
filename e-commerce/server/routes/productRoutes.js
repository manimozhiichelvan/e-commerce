const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const { getProducts, createProduct, deleteProduct } = require("../controllers/productController");

router.get("/", verifyToken, getProducts);
router.post("/", verifyToken, isAdmin, createProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

module.exports = router;