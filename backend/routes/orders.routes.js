const express = require("express");
const { createOrder, getOrders } = require("../controllers/orderController");
const asyncHandler = require("../middleware/asyncHandler");
const { validateOrder } = require("../middleware/orderMiddleware");

const router = express.Router();

router.get("/", asyncHandler(getOrders));
router.post("/", validateOrder, asyncHandler(createOrder));

module.exports = router;

