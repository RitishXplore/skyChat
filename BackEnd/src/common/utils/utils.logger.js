import fs from 'fs';
import path from 'path';
import winston from 'winston';
import config from '../../config/config.env.js';

/** Logger Directory Setup */
import { fileURLToPath } from 'url';

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDirectory = path.join(__dirname, '../../logs');

// Ensure the 'logs' directory exists, create if not
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

/** Logger Configuration */
export const logger = winston.createLogger({
    level: 'info',  // Set default logging level to 'info'
    format: winston.format.printf(({ level, message, timestamp }) => {
        // Custom log format without additional_info
        return JSON.stringify({
            date: timestamp,
            message: message,
            level: level
        });
    }),
    transports: [
        /** Log errors to a file */
        new winston.transports.File({
            filename: path.join(logDirectory, 'error.log'), 
            level: 'error',  // Only errors will be logged here
            format: winston.format.combine(
                winston.format.timestamp(),  // Add timestamp to each log entry
                winston.format.printf(({ level, message, timestamp }) => {
                    return JSON.stringify({
                        date: timestamp,
                        message: message,
                        level: level
                    });
                })
            ),
        }),
        /** Log all logs to the combined.log file */
        new winston.transports.File({
            filename: path.join(logDirectory, 'combined.log'),
            format: winston.format.combine(
                winston.format.timestamp(),  // Add timestamp to each log entry
                winston.format.printf(({ level, message, timestamp }) => {
                    return JSON.stringify({
                        date: timestamp,
                        message: message,
                        level: level
                    });
                })
            ),
        }),
    ]
});

/** Console Logger for Non-Production Environments */
if (config.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp(),  // Add timestamp to console logs
            winston.format.printf(({ level, message, timestamp }) => {
                return JSON.stringify({
                    date: timestamp,
                    message: message,
                    level: level
                });
            })
        ),
    }));
}

/** Stream Method for Logging */
logger.stream = {
    write: (message) => {
        // Trim the message and log it at the 'info' level
        logger.info(message.trim());
    },
};
