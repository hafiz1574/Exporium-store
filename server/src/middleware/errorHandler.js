const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error("[error]", err);
  }

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });

  next();
};

module.exports = errorHandler;
