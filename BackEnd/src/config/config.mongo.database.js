import mongoose from 'mongoose';
import config from './config.env.js';
import { logger } from '../common/utils/utils.logger.js';
let client = null;
const { DB_CONNECTION_STRING ,NODE_ENV } =config;
/**
 * @description Asynchronously connects to MongoDB using Mongoose and handles potential errors.
 * @returns {Promise<void>}
 */
const connectToMongoDB = async () => {
  try {
    // Attempt to connect to the MongoDB database
    client = await mongoose.connect(DB_CONNECTION_STRING);

    // Log the successful connection
    logger.info('MongoDB connected successfully');
   
  } catch (error) {
    // Log any connection errors
    logger.error(`MongoDB connection error: ${error}`);

    // @TODO: In production, exit and stop the server if MongoDB does not connect
    // process.exit(-1);
  }
};

// MongoDB connection event listeners
mongoose.connection
  .once('open', () => {
    logger.info('MongoDB connection established');
    
  })
  .on('error', (error) => {
    // Log MongoDB connection error
    logger.error(`MongoDB connection error: ${error.message}`);
    
    // @TODO: In production, exit and stop the server if MongoDB connection fails
    // process.exit(-1);
  });

// Enable Mongoose debug mode in development environment
if (NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

// Invoke the connection function
connectToMongoDB();

/**
 * @description Export the MongoDB client connection instance.
 * @returns {mongoose.Connection | null} The MongoDB connection object.
 */
export default client;
