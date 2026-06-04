const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config({ quiet: true });

const connectDB = require("./config/db");
const { isMemoryMode, setMemoryMode } = require("./config/appState");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const apiRoutes = require("./routes");
const { seedProducts } = require("./seeders/productSeeder");

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;
let databaseReady;

app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: process.env.CLIENT_URL || true
    })
  );
}

async function connectDatabase() {
  setMemoryMode(!(await connectDB(MONGO_URI)));
}

app.use("/api", apiRoutes);

if (process.env.NODE_ENV === "production") {
  const publicPath = path.join(__dirname, "public");
  app.use(express.static(publicPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);

async function initializeApp() {
  databaseReady ||= (async () => {
    await connectDatabase();
    if (!isMemoryMode()) {
      await seedProducts();
    }
  })();

  return databaseReady;
}

async function startServer() {
  try {
    await initializeApp();
    app.listen(PORT, () => {
      console.log(`CloudCart server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, initializeApp };
