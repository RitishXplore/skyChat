/**
 * -------------------------------------------------------------
 * @fileoverview MongoDB Initialization for the Application
 * @description Initializes the MongoDB connection by importing
 *              the configuration and connection setup.
 * @author Ritish Kumar
 * @date 2024-12-27
 * -------------------------------------------------------------
 */

/**
 * @description Asynchronously initializes the MongoDB connection by 
 *              importing the MongoDB configuration file.
 *              It dynamically imports the MongoDB setup configuration.
 * @returns {Promise<void>}
 */
export const initMongoDatabase = async () => {
    try {
      // Dynamically import the MongoDB configuration file
      await import("../../config/config.mongo.database.js");
      
      // Log success message (Optional: Integrate logger if needed)
      console.log("MongoDB initialization successful");
    } catch (error) {
      // Log the error message in case of failure
      console.error(`Error initializing MongoDB: ${error.message}`);
      
      // @TODO: Handle error case or exit if critical
      // process.exit(-1);
    }
  };
  