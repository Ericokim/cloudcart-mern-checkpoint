const Product = require("../models/Product");
const starterProducts = require("../data/products");
const { isMemoryMode } = require("../config/appState");

const memoryProducts = starterProducts.map((product) => ({
  ...product,
  _id: product.name.toLowerCase().replaceAll(" ", "-")
}));

function filterMemoryProducts(products, query) {
  const searchTerm = (query.search || "").trim().toLowerCase();

  return [...products]
    .filter((product) => {
      const matchesSearch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm);
      const matchesStock =
        query.stock === "available"
          ? product.stock > 0
          : query.stock === "low"
            ? product.stock > 0 && product.stock <= 5
            : true;

      return matchesSearch && matchesStock;
    })
    .sort((first, second) => {
      if (query.sort === "price-low") {
        return first.price - second.price;
      }

      if (query.sort === "price-high") {
        return second.price - first.price;
      }

      if (query.sort === "name") {
        return first.name.localeCompare(second.name);
      }

      return 0;
    });
}

function buildProductQuery(query) {
  const mongoQuery = {};
  const searchTerm = (query.search || "").trim();

  if (searchTerm) {
    mongoQuery.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } }
    ];
  }

  if (query.stock === "available") {
    mongoQuery.stock = { $gt: 0 };
  }

  if (query.stock === "low") {
    mongoQuery.stock = { $gt: 0, $lte: 5 };
  }

  return mongoQuery;
}

function buildSort(sort) {
  if (sort === "price-low") {
    return { price: 1 };
  }

  if (sort === "price-high") {
    return { price: -1 };
  }

  if (sort === "name") {
    return { name: 1 };
  }

  return { createdAt: -1 };
}

async function getProducts(req, res) {
  if (isMemoryMode()) {
    return res.json(filterMemoryProducts(memoryProducts, req.query));
  }

  const products = await Product.find(buildProductQuery(req.query)).sort(buildSort(req.query.sort));
  res.json(products);
}

async function getProductById(req, res) {
  if (isMemoryMode()) {
    const product = memoryProducts.find((entry) => entry._id === req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found.");
    }

    return res.json(product);
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  res.json(product);
}

function buildProductPayload(body) {
  return {
    name: body.name,
    description: body.description,
    price: Number(body.price),
    stock: Number(body.stock),
    image: body.image || ""
  };
}

async function createProduct(req, res) {
  const payload = buildProductPayload(req.body);

  if (isMemoryMode()) {
    const product = {
      ...payload,
      _id: `product-${Date.now()}`
    };

    memoryProducts.push(product);
    return res.status(201).json(product);
  }

  const product = await Product.create(payload);
  res.status(201).json(product);
}

async function updateProduct(req, res) {
  const payload = buildProductPayload(req.body);

  if (isMemoryMode()) {
    const product = memoryProducts.find((entry) => entry._id === req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found.");
    }

    Object.assign(product, payload);
    return res.json(product);
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  Object.assign(product, payload);
  await product.save();
  res.json(product);
}

async function deleteProduct(req, res) {
  if (isMemoryMode()) {
    const index = memoryProducts.findIndex((entry) => entry._id === req.params.id);

    if (index === -1) {
      res.status(404);
      throw new Error("Product not found.");
    }

    memoryProducts.splice(index, 1);
    return res.json({ message: "Product removed." });
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  await product.deleteOne();
  res.json({ message: "Product removed." });
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  memoryProducts
};
