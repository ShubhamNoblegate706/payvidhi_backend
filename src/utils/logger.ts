import winston from "winston";
import fs from "fs";
import path from "path";

/**
 * =========================================================
 * Create Logs Directory Automatically
 * =========================================================
 */

const logsDirectory = path.resolve("logs");

if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory, { recursive: true });
}

/**
 * =========================================================
 * Custom Console Log Format
 * =========================================================
 * Human-readable logs for development.
 */

const consoleLogFormat = winston.format.printf(
  ({ level, message, timestamp, stack }) => {
    return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LEVEL      : ${level.toUpperCase()}
TIME       : ${timestamp}
MESSAGE    : ${stack || message}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  }
);

/**
 * =========================================================
 * Console Format
 * =========================================================
 */

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss"
  }),
  winston.format.errors({ stack: true }),
  consoleLogFormat
);

/**
 * =========================================================
 * File Format
 * =========================================================
 * JSON structured logs for production systems.
 */

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * =========================================================
 * Main Logger Configuration
 * =========================================================
 */

const logger = winston.createLogger({
  level: "info",

  /**
   * Default log format for files
   */
  format: fileFormat,

  /**
   * Handle uncaught exceptions
   */
  exceptionHandlers: [
    new winston.transports.File({
      filename: "logs/exceptions.log"
    })
  ],

  /**
   * Handle unhandled promise rejections
   */
  rejectionHandlers: [
    new winston.transports.File({
      filename: "logs/rejections.log"
    })
  ],

  /**
   * Log Outputs / Transports
   */
  transports: [
    /**
     * Console Transport
     */
    new winston.transports.Console({
      format: consoleFormat
    }),

    /**
     * Combined Application Logs
     */
    new winston.transports.File({
      filename: "logs/combined.log",
      level: "info"
    }),

    /**
     * Error Logs Only
     */
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error"
    })
  ]
});

/**
 * =========================================================
 * Stream Object
 * =========================================================
 * Useful for integrating with morgan HTTP logger.
 */

export const loggerStream = {
  write: (message: string): void => {
    logger.info(message.trim());
  }
};

export default logger;