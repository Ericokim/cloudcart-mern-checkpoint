function validateProduct(req, res, next) {
  const { name, description, price, stock } = req.body;

  if (
    !name ||
    !description ||
    price === undefined ||
    Number.isNaN(Number(price)) ||
    Number(price) < 0 ||
    stock === undefined ||
    Number.isNaN(Number(stock)) ||
    Number(stock) < 0
  ) {
    return res.status(400).json({
      message: "Name, description, non-negative price, and non-negative stock are required."
    });
  }

  next();
}

module.exports = { validateProduct };
