const mongoose = require("mongoose");
require("dotenv").config({ quiet: true });

const connectDB = require("./config/db");
const Product = require("./models/Product");
const Order = require("./models/Order");
const starterProducts = require("./data/products");

async function importData() {
  const connected = await connectDB(process.env.MONGO_URI);
  if (!connected) {
    throw new Error("MONGO_URI is required for seeding.");
  }

  await Order.deleteMany();
  await Product.deleteMany();
  await Product.insertMany(starterProducts);
  console.log("CloudCart seed data imported");
}

async function destroyData() {
  const connected = await connectDB(process.env.MONGO_URI);
  if (!connected) {
    throw new Error("MONGO_URI is required for seeding.");
  }

  await Order.deleteMany();
  await Product.deleteMany();
  console.log("CloudCart seed data destroyed");
}

async function run() {
  try {
    if (process.argv[2] === "-d") {
      await destroyData();
    } else {
      await importData();
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

run();
