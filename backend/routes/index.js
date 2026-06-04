const express = require("express");
const { getHealth } = require("../controllers/healthController");
const authRoutes = require("./auth.routes");
const orderRoutes = require("./orders.routes");
const productRoutes = require("./products.routes");

const router = express.Router();

router.get("/health", getHealth);
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);

module.exports = router;

