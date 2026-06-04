const mongoose = require("mongoose");

async function connectDB(mongoUri) {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  if (!mongoUri) {
    console.warn("MONGO_URI is missing. CloudCart is running with in-memory demo data.");
    return false;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 12000
    });
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    console.warn("CloudCart is running with in-memory demo data.");
    return false;
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error(`MongoDB runtime error: ${error.message}`);
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected");
});

module.exports = connectDB;

