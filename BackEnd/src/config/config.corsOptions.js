/** --------------------------------
 *  CORS Options Configuration
 * ---------------------------------
 * @fileoverview CORS settings for the app.
 * Author: Ritish Kumar
 * Date: 2024-12-27
 */

export const corsOption = {
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    exposedHeaders: ["x-auth-token"],
  };
  