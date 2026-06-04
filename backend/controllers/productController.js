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

module.exports = { getProducts, memoryProducts };
