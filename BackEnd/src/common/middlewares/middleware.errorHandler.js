import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import express from 'express';  // Added express import (required for static middleware)
import { fileURLToPath } from 'url';

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the public directory
const publicDirectoryPath = path.join(__dirname, "../../public");

// Create a write stream for access log in append mode
let accessLogStream = fs.createWriteStream(path.join(__dirname, "../../../logs/access.log"), { flags: "a" });

/**
 * @description - Initializes middleware for logging and error handling
 * @param {Object} param0 - Express app instance
 * @param {import("express").Application} param0.app - Express app
 */
const initMiddlewares = ( app ) => {
  // Set view engine to EJS
  app.set("view engine", "ejs");

  // Serve static files from the 'public' directory
  app.use("/static", express.static(publicDirectoryPath));

  // Use morgan for HTTP request logging with the 'combined' format
  app.use(morgan("combined", { stream: accessLogStream }));

  // Catch 404 errors and forward to error handler
  app.use((req, res, next) => {
    res.status(404).send("Not Found");
  });

  // General error handler for all unhandled errors
  app.use((err, req, res, next) => {
    console.error(err); // Log the error for debugging purposes

    // In development, send the error message directly
    if (process.env.NODE_ENV === "development") {
      return res.status(500).send(err.message);
    }

    // For production, send a generic error response
    res.status(500).send("Internal Server Error");
  });
};

export default initMiddlewares;
