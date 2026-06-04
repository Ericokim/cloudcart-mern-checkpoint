const mongoose = require("mongoose");
const { isMemoryMode } = require("../config/appState");

function getHealth(req, res) {
  res.json({
    status: "ok",
    app: "CloudCart",
    database: mongoose.connection.readyState === 1 ? "connected" : "not connected",
    databaseMode: isMemoryMode() ? "memory demo" : "mongodb"
  });
}

module.exports = { getHealth };

