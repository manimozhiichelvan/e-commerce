const express = require("express");
const router = express.Router();

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct
} = require("../controllers/productController");

router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  createProduct
);

router.get("/", getProducts);

router.delete("/:id", verifyToken, isAdmin, deleteProduct);

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  updateProduct
);

module.exports = router;