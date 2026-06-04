const Product = require("../models/Product");
const starterProducts = require("../data/products");

async function seedProducts() {
  const productCount = await Product.countDocuments();

  if (productCount === 0) {
    await Product.insertMany(starterProducts);
    console.log("Starter products added");
  }
}

module.exports = { seedProducts };

