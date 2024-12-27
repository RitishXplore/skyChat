import express  from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
const router = express.Router();
import { options } from "../config/config.swagger.js";
router.get("/status", (req, res) => res.send("OK"));
const specs = swaggerJsdoc(options);
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


export default router ;