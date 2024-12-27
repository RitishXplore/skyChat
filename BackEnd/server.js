/** -------------------------------
 *  Server Initialization
 * --------------------------------
 * @fileoverview Entry point for starting the server.
 * Binds the application to a specific port and logs its status.
 */

// Dependencies
import app from "./app.js";
import config from "./src/config/config.env.js";
const {PORT, BASE_URL} = config;
// Default Port Fallback
const Port = PORT || 6502;

// Logger Utility
const logger = {
    info: (message) => console.log(`[INFO] ${message}`),
    error: (message) => console.error(`[ERROR] ${message}`),
};

// Start Server
app.listen(Port, () => {
    logger.info(`App listening on ${BASE_URL}:${Port}`);
});
