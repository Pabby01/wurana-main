import winston from 'winston';
import 'winston-daily-rotate-file';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Add colors to winston
winston.addColors(colors);

// Define format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define file transport for rotating logs
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/wurana-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: winston.format.combine(
    winston.format.uncolorize(),
    winston.format.json()
  ),
});

// Define transports for different environments
const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
  fileRotateTransport,
];

// Create the logger instance
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

// Create a stream object for Morgan integration
const stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

// Error logging helper
const logError = (err, req = null) => {
  const errorDetails = {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  };

  if (req) {
    errorDetails.method = req.method;
    errorDetails.url = req.url;
    errorDetails.headers = req.headers;
    errorDetails.body = req.body;
    errorDetails.params = req.params;
    errorDetails.query = req.query;
  }

  logger.error(JSON.stringify(errorDetails));
};

// API request logging helper
const logAPIRequest = (req, res, duration) => {
  const logData = {
    method: req.method,
    url: req.url,
    status: res.statusCode,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString(),
    ip: req.ip,
    user: req.user ? req.user._id : 'anonymous',
  };

  logger.info(JSON.stringify(logData));
};

// Transaction logging helper
const logTransaction = (transaction) => {
  const logData = {
    type: 'transaction',
    id: transaction._id,
    user: transaction.user,
    amount: transaction.amount,
    status: transaction.status,
    timestamp: new Date().toISOString(),
  };

  logger.info(JSON.stringify(logData));
};

// Security event logging helper
const logSecurityEvent = (event) => {
  const logData = {
    type: 'security',
    event: event.type,
    user: event.user,
    ip: event.ip,
    details: event.details,
    timestamp: new Date().toISOString(),
  };

  logger.warn(JSON.stringify(logData));
};

export {
  logger,
  stream,
  logError,
  logAPIRequest,
  logTransaction,
  logSecurityEvent,
};