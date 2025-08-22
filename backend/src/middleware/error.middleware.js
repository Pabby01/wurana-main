import { logError } from '../config/logger.js';

// Custom error class for API errors
export class APIError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle 404 errors
export const notFound = (req, res, next) => {
  const error = new APIError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

// Handle validation errors
export const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new APIError(message, 400);
};

// Handle JWT errors
export const handleJWTError = () =>
  new APIError('Invalid token. Please log in again!', 401);

export const handleJWTExpiredError = () =>
  new APIError('Your token has expired! Please log in again.', 401);

// Handle duplicate field errors
export const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new APIError(message, 400);
};

// Handle cast errors
export const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new APIError(message, 400);
};

// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error
  logError(err, req);

  // Development error response
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  // Programming or other unknown error: don't leak error details
  console.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
  });
};

// Error handler for async functions
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Rate limiting error handler
export const handleTooManyRequests = (req, res) => {
  const error = new APIError(
    'Too many requests from this IP, please try again later.',
    429
  );
  logError(error, req);
  res.status(429).json({
    status: 'error',
    message: error.message,
  });
};

// Solana wallet errors handler
export const handleSolanaError = (err) => {
  let message = 'Solana transaction failed';
  let statusCode = 400;

  if (err.message.includes('insufficient funds')) {
    message = 'Insufficient funds in wallet';
  } else if (err.message.includes('invalid signature')) {
    message = 'Invalid wallet signature';
  } else if (err.message.includes('timeout')) {
    message = 'Transaction timed out. Please try again.';
    statusCode = 408;
  }

  return new APIError(message, statusCode, { originalError: err.message });
};

// File upload error handler
export const handleFileUploadError = (err) => {
  let message = 'File upload failed';
  let statusCode = 400;

  if (err.code === 'LIMIT_FILE_SIZE') {
    message = 'File is too large';
  } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    message = 'Invalid file type';
  }

  return new APIError(message, statusCode, { originalError: err.message });
};

// Socket.IO error handler
export const handleSocketError = (err, socket) => {
  const error = {
    message: err.message || 'Socket error occurred',
    code: err.code || 'SOCKET_ERROR',
  };

  logError(new Error(error.message));
  socket.emit('error', error);
};