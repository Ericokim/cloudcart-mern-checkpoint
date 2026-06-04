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

async function getProfile(req, res) {
  // `protect` already attached the current public user.
  res.json({ user: req.user });
}

async function updateProfile(req, res) {
  const { name, email } = req.body;
  const normalizedEmail = email.toLowerCase().trim();
  const userId = req.user._id.toString();

  if (isMemoryMode()) {
    const user = memoryUsers.find((entry) => entry._id === userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const taken = memoryUsers.some(
      (entry) => entry.email === normalizedEmail && entry._id !== userId
    );

    if (taken) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    user.name = name;
    user.email = normalizedEmail;
    return res.json({ user: toPublicUser(user) });
  }

  const taken = await User.findOne({ email: normalizedEmail, _id: { $ne: userId } });

  if (taken) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  user.name = name;
  user.email = normalizedEmail;
  await user.save();

  res.json({ user: toPublicUser(user) });
}

async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id.toString();

  if (isMemoryMode()) {
    const user = memoryUsers.find((entry) => entry._id === userId);
    const isMatch = user ? await bcrypt.compare(currentPassword, user.password) : false;

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    return res.json({ message: "Password updated." });
  }

  const user = await User.findById(userId);
  const isMatch = user ? await user.matchPassword(currentPassword) : false;

  if (!isMatch) {
    return res.status(401).json({ message: "Current password is incorrect." });
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password updated." });
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  memoryUsers,
  toPublicUser
};
