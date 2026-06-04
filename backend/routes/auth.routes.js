const express = require("express");
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
} = require("../controllers/authController");
const asyncHandler = require("../middleware/asyncHandler");
const { protect } = require("../middleware/authMiddleware");
const {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange
} = require("../middleware/authValidation");

const router = express.Router();

router.post("/register", validateRegister, asyncHandler(register));
router.post("/login", validateLogin, asyncHandler(login));
router.get("/profile", protect, asyncHandler(getProfile));
router.put("/profile", protect, validateProfileUpdate, asyncHandler(updateProfile));
router.put("/password", protect, validatePasswordChange, asyncHandler(changePassword));

module.exports = router;
