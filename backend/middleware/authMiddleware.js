const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("./asyncHandler");
const { isMemoryMode } = require("../config/appState");
const { memoryUsers, toPublicUser } = require("../controllers/authController");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Not authorized, no token provided.");
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token is invalid.");
  }

  let user;
  if (isMemoryMode()) {
    const found = memoryUsers.find((entry) => entry._id === decoded.id);
    user = found ? toPublicUser(found) : null;
  } else {
    user = await User.findById(decoded.id).select("-password");
  }

  if (!user) {
    res.status(401);
    throw new Error("Not authorized, user not found.");
  }

  req.user = user;
  next();
});

function admin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    res.status(403);
    throw new Error("Not authorized as an admin.");
  }

  next();
}

module.exports = { protect, admin };
