/**
 * -----------------------------------------------
 * @fileoverview - Async Handler for Express
 * @description - A higher-order function that wraps an async route handler to catch any errors 
 *                and pass them to the next error handler in Express.
 * @author - Ritish Kumar
 * @date - 2024-12-27
 * -----------------------------------------------
 */

/**
 * @description - This function wraps asynchronous route handlers in Express.
 *                It ensures any errors are caught and passed to the next middleware.
 * @param {Function} handler - The async route handler to wrap.
 * @returns {Function} - A function that can be used as an Express middleware.
 */
const asyncHandler = (handler) => (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
};

export default asyncHandler;
