const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { isMemoryMode } = require("../config/appState");
const { memoryProducts } = require("./productController");

let memoryOrders = [];

// Resolve an optional logged-in user id from a Bearer token without
// rejecting guest checkout. Returns null when absent or invalid.
function resolveOptionalUserId(req) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  try {
    const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
}

function buildOrderItems(items, products, shouldUpdateStock = false) {
  return items.map((item) => {
    const product = products.find((entry) => entry._id.toString() === item.productId);

    if (!product) {
      throw new Error("A product in the cart no longer exists.");
    }

    const quantity = Math.max(1, Number(item.quantity) || 1);

    if (quantity > product.stock) {
      throw new Error(`${product.name} only has ${product.stock} items in stock.`);
    }

    if (shouldUpdateStock) {
      product.stock -= quantity;
    }

    return {
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity
    };
  });
}

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

async function getOrders(req, res) {
  if (isMemoryMode()) {
    return res.json(memoryOrders.slice(0, 10));
  }

  const orders = await Order.find().sort({ createdAt: -1 }).limit(10);
  res.json(orders);
}

async function createOrder(req, res) {
  const { customerEmail, customerName, customerPhone, deliveryAddress, items } = req.body;
  const userId = resolveOptionalUserId(req);

  if (isMemoryMode()) {
    const orderItems = buildOrderItems(items, memoryProducts, true);
    const order = {
      _id: `order-${Date.now()}`,
      user: userId,
      customerEmail,
      customerName,
      customerPhone,
      deliveryAddress,
      items: orderItems,
      total: calculateTotal(orderItems),
      status: "Processing",
      createdAt: new Date().toISOString()
    };

    memoryOrders = [order, ...memoryOrders];
    return res.status(201).json(order);
  }

  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const orderItems = buildOrderItems(items, products);
  const order = await Order.create({
    user: userId,
    customerEmail,
    customerName,
    customerPhone,
    deliveryAddress,
    items: orderItems,
    total: calculateTotal(orderItems)
  });

  await Promise.all(
    orderItems.map((item) =>
      Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } })
    )
  );

  res.status(201).json(order);
}

async function getMyOrders(req, res) {
  const userId = req.user._id.toString();

  if (isMemoryMode()) {
    return res.json(memoryOrders.filter((order) => order.user === userId));
  }

  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  res.json(orders);
}

module.exports = { createOrder, getOrders, getMyOrders };
