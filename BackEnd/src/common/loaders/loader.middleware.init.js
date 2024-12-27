/** --------------------------------
 *  Initialization Loader for SkyChat
 * ---------------------------------
 * @fileoverview Initialize the app setup: middlewares, error handling, etc.
 * Author: Ritish Kumar
 * Date: 2024-12-27
 */

import initRequestParserMiddlewares from "../middlewares/middleware.requestParser.js";
import initMiddlewares from "../middlewares/middleware.errorHandler.js";

/**
 * @description - This function initializes all required middlewares and configurations
 * @param {import("express").Application} app - Express app
 * @param {import("express").Express} express - Express instance
 */
const initMainMiddlewares =  ({ app, express }) => {
  // Initialize request parser middlewares (CORS, JSON parser, URL encoding)
   initRequestParserMiddlewares({ app, express });

  // Initialize other middlewares (error handling, logging, etc.)
    initMiddlewares(app);
};

export default initMainMiddlewares;
