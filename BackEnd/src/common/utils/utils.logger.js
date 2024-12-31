import fs from 'fs';
import path from 'path';
import winston from 'winston';
import config from '../../config/config.env.js'; // Assuming this is the correct config import
import { fileURLToPath } from 'url';

/** Logger Directory Setup */
// Get the root directory of the project (BackEnd folder)
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);  // Get the current directory of the logger file

// Resolve the BackEnd root directory (this will always point to the BackEnd folder)
const backEndRoot = path.resolve(__dirname, '../../../'); // Moving 2 levels up to BackEnd directory
const logDirectory = path.join(backEndRoot, 'logs'); // Logs directory in the BackEnd folder

console.log('Log directory is set to:', logDirectory); // For debugging: ensure it's pointing to the correct directory

// Ensure the 'logs' directory exists, create it if not
if (!fs.existsSync(logDirectory)) {
    console.log('Creating logs directory at:', logDirectory); // Debug message for directory creation
    fs.mkdirSync(logDirectory, { recursive: true });
}

// Paths for individual log files (absolute paths)
const errorLogPath = path.join(logDirectory, 'error.log');
const combinedLogPath = path.join(logDirectory, 'combined.log');
const accessLogPath = path.join(logDirectory, 'access.log');

// Ensure log files exist
const ensureFileExists = (filePath) => {
    if (!fs.existsSync(filePath)) {
        console.log('Creating log file at:', filePath); // Debug message for log file creation
        fs.writeFileSync(filePath, '', { flag: 'w' }); // Create the log file if it doesn't exist
    }
};

[errorLogPath, combinedLogPath, accessLogPath].forEach(ensureFileExists);

/** Logger Configuration */
export const logger = winston.createLogger({
    level: 'info', // Default logging level
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ level, message, timestamp }) => {
            return JSON.stringify({
                date: timestamp,
                message: message,
                level: level
            });
        })
    ),
    transports: [
        /** Error logs */
        new winston.transports.File({
            filename: errorLogPath,
            level: 'error'
        }),
        /** Access logs */
        new winston.transports.File({
            filename: accessLogPath,
            level: 'info'
        }),
        /** All logs */
        new winston.transports.File({
            filename: combinedLogPath
        }),
    ]
});

/** Console Logger for Non-Production Environments */
if (config.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
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

/** Stream Method for HTTP Request Logging */
logger.stream = {
    write: (message) => {
        logger.info(message.trim()); // Removed async/await as it's not needed for this simple logging
    },
};

// Debug message for verifying logger paths
console.log('✅ Logger initialized. Logs are stored in:', logDirectory);
