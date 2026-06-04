function validateOrder(req, res, next) {
  const { customerEmail, customerName, deliveryAddress, items } = req.body;

  if (
    !customerName ||
    !customerEmail ||
    !customerEmail.includes("@") ||
    !deliveryAddress ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({
      message: "Name, valid email, delivery address, and cart items are required."
    });
  }

  next();
}

module.exports = { validateOrder };
