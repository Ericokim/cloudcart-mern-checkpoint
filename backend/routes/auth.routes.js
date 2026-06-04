const express = require("express");
const { register, login } = require("../controllers/authController");
const asyncHandler = require("../middleware/asyncHandler");
const { validateRegister, validateLogin } = require("../middleware/authValidation");

const router = express.Router();

router.post("/register", validateRegister, asyncHandler(register));
router.post("/login", validateLogin, asyncHandler(login));

module.exports = router;
