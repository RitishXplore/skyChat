/** -----------------------------
 *  Config API documentation
 *  ------------------------------
 * @fileoverview Env Configuration for SkyChat API.
 *  Author: RitishXplore
 *  Date: 2024-12-27 
 */
import dotenv from 'dotenv';
dotenv.config(); 

  const config = {
    PORT: process.env.PORT || '',
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING || '',
    NODE_ENV: process.env.NODE_ENV || '',
    BASE_URL: process.env.BASE_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    JWT_FORGOT_PASSWORD_SECRET: process.env.JWT_FORGOT_PASSWORD_SECRET || '',
    JWT_EXPIRATION_INTERVAL: process.env.JWT_EXPIRATION_INTERVAL || '',
    SALT_ROUNDS: process.env.SALT_ROUNDS || ''
};
export default config;