const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");
const asyncHandler = require("../middleware/asyncHandler");
const { protect, admin } = require("../middleware/authMiddleware");
const { validateProduct } = require("../middleware/productMiddleware");

const router = express.Router();

router.get("/", asyncHandler(getProducts));
router.get("/:id", asyncHandler(getProductById));
router.post("/", protect, admin, validateProduct, asyncHandler(createProduct));
router.put("/:id", protect, admin, validateProduct, asyncHandler(updateProduct));
router.delete("/:id", protect, admin, asyncHandler(deleteProduct));

module.exports = router;
