function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message || "Something went wrong.",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
}

module.exports = { errorHandler, notFound };

