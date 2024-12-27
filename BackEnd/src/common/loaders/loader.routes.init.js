/**
 * -----------------------------------------------
 * @fileoverview - Main routing setup for the application
 * @description - This file defines and initializes the app's main routing endpoints.
 * @author - Ritish Kumar
 * @date - 2024-12-27
 * -----------------------------------------------
 */

import apiV1Routes from "../../api/api.index.routes.js";
import adminAuthRoutes from '../../api/api.admin.routes.js';  // Renamed for better clarity

/**
 * @description - Configuration of main routes to be used in the application
 * @type {Array<{ method: string, url: string, handler: Function }> }
 */
const routes = [
    {
        method: "use",
        url: "/v1",  // API versioning route
        handler: apiV1Routes,  // Updated name for API version 1 routes
    },
    {
        method: "use",
        url: "/admin",  // Admin route
        handler: adminAuthRoutes,  // Renamed for admin authentication context
    },
];

/**
 * @description - Initializes and registers routes in the Express app
 * @param {Application} app - Express Application instance
 */
const initRoutes = ({ app }) => {
    routes.forEach((route) => {
        app[route.method](route.url, route.handler);
    });
};

export { initRoutes };
