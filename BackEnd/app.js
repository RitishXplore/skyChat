/** -------------------------------
 *  Application Initialization
 * --------------------------------
 * @fileoverview Entry point for the Express.js server.
 * Initializes routes, middlewares, database, and socket connections.
 */

// Dependencies
import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Loaders
import { initRoutes } from "./src/common/loaders/loader.routes.init.js";
import { initMongoDatabase } from "./src/common/loaders/loader.mongo.database.init.js";
// Logger Initialization
import {logger} from "./src/common/utils/utils.logger.js";
import initMainMiddlewares from "./src/common/loaders/loader.middleware.init.js";
global.logger = logger;

// Directory Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Express App Initialization
const app = express();


// Middleware: CORS Configuration
app.use(cors());

// Middleware: Static Files
app.use(express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static("images"));

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (error) => {
    console.error("❌ Uncaught Error:", error.message);
    logger.error("Unhandled Rejection:", error);
});


/** -------------------------------
 *  App Initialization
 * --------------------------------
 * Encapsulates the initialization logic into an IIFE.
 */
(async function initializeApp() {
    try {
        // Middleware Initialization
        initMainMiddlewares({app,express});
        // Route Initialization
        initRoutes({ app });

        // Database Initialization
        await initMongoDatabase();

        logger.info("✅ Application initialized successfully.");
    } catch (error) {
        console.error("❌ Failed to initialize application:", error.message);
        logger.error("Application Initialization Error:", error);
        process.exit(1);
    }
})();

export default app;
