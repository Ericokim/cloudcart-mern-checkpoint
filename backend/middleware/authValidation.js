function validateRegister(req, res, next) {
  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.length < 6
  ) {
    return res.status(400).json({
      message: "Name, valid email, and a password of at least 6 characters are required."
    });
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !email.includes("@") || !password) {
    return res.status(400).json({
      message: "Valid email and password are required."
    });
  }

  next();
}

function validateProfileUpdate(req, res, next) {
  const { name, email } = req.body;

  if (!name || !email || !email.includes("@")) {
    return res.status(400).json({
      message: "Name and a valid email are required."
    });
  }

  next();
}

function validatePasswordChange(req, res, next) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({
      message: "Current password and a new password of at least 6 characters are required."
    });
  }

  next();
}

module.exports = { validateRegister, validateLogin, validateProfileUpdate, validatePasswordChange };
