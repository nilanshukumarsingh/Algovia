/**
 * Global error handler middleware.
 * Must be registered LAST in index.js (after all routes).
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';

  const statusCode = err.statusCode || err.status || 500;

  // Never leak internal error details in production
  const message = isDev
    ? err.message || 'Internal Server Error'
    : statusCode < 500
      ? err.message
      : 'Internal Server Error';

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
