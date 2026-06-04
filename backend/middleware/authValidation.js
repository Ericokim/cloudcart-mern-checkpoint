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

module.exports = { validateRegister, validateLogin };
