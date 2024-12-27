/** --------------------------------
 *  Swagger API Documentation
 * ---------------------------------
 * @fileoverview Swagger configuration for SkyChat API.
 *  Author: RitishXplore
 *  Date: 2024-12-27
 */

export const swaggerDefination = {
    openapi: "3.0.0",

    info: {
        version: "1.0.0",
        title: "SkyChat",
        description: "List of Swagger API versions v1.0.0",
    },

    servers: [
        {
            url: "http://localhost:4000",
            description: "Local Server",
        }
    ],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            }
        }
    },

    consumes: [
        "application/json",
        "multipart/form-data"
    ],

    produces: [
        "application/json"
    ]
};
export const options = {
    /** Swagger Definition */
    swaggerDefinition: swaggerDefination,

    /** API Files for Documentation */
    apis: [
        // API routes files under the 'src/api' folder structure
        "./src/api/**/*.routes.js",  // Matches all .routes.js files in the src/api folder and subfolders

        // Model files for documentation under the 'src/api' folder structure
        "./src/api/**/*.model.js",  // Matches all .model.js files in the src/api folder and subfolders
    ],
};