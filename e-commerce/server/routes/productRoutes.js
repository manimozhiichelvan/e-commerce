const express = require("express");
const router = express.Router();

const {
  getProducts,
  createProduct,
  deleteProduct,
} = require("../controllers/productController");

const { verifyToken, isAdmin } =
  require("../middleware/authMiddleware");


router.get("/", getProducts);


router.post("/", verifyToken, isAdmin, createProduct);


router.delete("/:id", verifyToken, isAdmin, deleteProduct);

module.exports = router;