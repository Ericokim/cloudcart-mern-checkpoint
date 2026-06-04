const express = require("express");
const { getProducts } = require("../controllers/productController");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(getProducts));

module.exports = router;

