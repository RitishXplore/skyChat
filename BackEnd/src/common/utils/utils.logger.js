import fs from 'fs';
import path from 'path';
import winston from 'winston';
import config from '../../config/config.env.js';
import { fileURLToPath } from 'url';

/** Logger Directory Setup */
// Get the root directory of the `BackEnd` folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Navigate to BackEnd directory
const backEndRoot = path.resolve(__dirname, '../../../'); // Move up from src to BackEnd
const logDirectory = path.join(backEndRoot, 'logs');

// Ensure the 'logs' directory exists, create if not
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

/** Logger Configuration */
export const logger = winston.createLogger({
    level: 'info',  // Set default logging level to 'info'
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss' // Local timezone timestamp
        }),
        winston.format.printf(({ level, message, timestamp }) => {
            return JSON.stringify({
                date: timestamp,
                message: message,
                level: level
            });
        })
    ),
    transports: [
        /** Log errors to a file */
        new winston.transports.File({
            filename: path.join(logDirectory, 'error.log'),
            level: 'error'
        }),
        /** Log all logs to the combined.log file */
        new winston.transports.File({
            filename: path.join(logDirectory, 'combined.log')
        }),
    ]
});

/** Console Logger for Non-Production Environments */
if (config.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss' // Local timezone timestamp
            }),
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
        logger.info(message.trim());
    },
};
