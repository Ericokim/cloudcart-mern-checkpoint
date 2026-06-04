const Order = require("../models/Order");
const Product = require("../models/Product");
const { isMemoryMode } = require("../config/appState");
const { memoryProducts } = require("./productController");

let memoryOrders = [];

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

  if (isMemoryMode()) {
    const orderItems = buildOrderItems(items, memoryProducts, true);
    const order = {
      _id: `order-${Date.now()}`,
      customerEmail,
      customerName,
      customerPhone,
      deliveryAddress,
      items: orderItems,
      total: calculateTotal(orderItems),
      createdAt: new Date().toISOString()
    };

    memoryOrders = [order, ...memoryOrders];
    return res.status(201).json(order);
  }

  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const orderItems = buildOrderItems(items, products);
  const order = await Order.create({
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

module.exports = { createOrder, getOrders };
