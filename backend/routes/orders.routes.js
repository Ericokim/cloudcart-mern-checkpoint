const express = require("express");
const { createOrder, getOrders, getMyOrders } = require("../controllers/orderController");
const asyncHandler = require("../middleware/asyncHandler");
const { validateOrder } = require("../middleware/orderMiddleware");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", asyncHandler(getOrders));
router.get("/mine", protect, asyncHandler(getMyOrders));
router.post("/", validateOrder, asyncHandler(createOrder));

module.exports = router;
