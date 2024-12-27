/** --------------------------------
 *  Request Parser Middleware Setup
 * ---------------------------------
 * @fileoverview Request parser middlewares for Express app.
 * Author: Ritish Kumar
 * Date: 2024-12-27
 */

import bodyParser from 'body-parser';
import cors from 'cors';
import { corsOption } from '../../config/config.corsOptions.js';

/**
 * @description Initializes request parser middlewares (CORS, JSON parser, URL encoding)
 * @param {Object} param0 - Express app instance
 * @param {import("express").Application} param0.app - Express app
 * @param {import("express").Express} param0.express - Express instance
 */
const initRequestParserMiddlewares = ({ app, express }) => {
  app.use(cors(corsOption));
  app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
  app.use(bodyParser.json({ verify: (req, res, buf) => { req.rawBody = buf; }, limit: "50mb" }));
  app.use(express.json());
};

export default initRequestParserMiddlewares;
