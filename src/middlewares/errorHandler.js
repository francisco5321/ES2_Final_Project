function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const message =
    statusCode === 500 ? "Internal server error." : error.message;

  res.status(statusCode).json({
    error: {
      message,
      statusCode
    }
  });
}

module.exports = errorHandler;
