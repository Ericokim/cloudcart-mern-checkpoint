const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { isMemoryMode } = require("../config/appState");

// In-memory user store for fallback mode (parity with products/orders).
const memoryUsers = [];

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || "24h"
  });
}

// Strip password before sending a user back to the client.
function toPublicUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin
  };
}

async function register(req, res) {
  const { name, email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  if (isMemoryMode()) {
    const exists = memoryUsers.some((user) => user.email === normalizedEmail);

    if (exists) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const user = {
      _id: `user-${Date.now()}`,
      name,
      email: normalizedEmail,
      password: await bcrypt.hash(password, salt),
      isAdmin: false
    };

    memoryUsers.push(user);

    return res.status(201).json({
      user: toPublicUser(user),
      token: generateToken(user._id)
    });
  }

  const exists = await User.findOne({ email: normalizedEmail });

  if (exists) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const user = await User.create({ name, email: normalizedEmail, password });

  res.status(201).json({
    user: toPublicUser(user),
    token: generateToken(user._id)
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  if (isMemoryMode()) {
    const user = memoryUsers.find((entry) => entry.email === normalizedEmail);
    const isMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.json({
      user: toPublicUser(user),
      token: generateToken(user._id)
    });
  }

  const user = await User.findOne({ email: normalizedEmail });
  const isMatch = user ? await user.matchPassword(password) : false;

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  res.json({
    user: toPublicUser(user),
    token: generateToken(user._id)
  });
}

module.exports = { register, login, memoryUsers, toPublicUser };
