import express from "express";
import { cred } from "./config/config";
const app = express();

app.listen(cred.port ,()=>{
  console.log(`Server is listening on PORT: ${cred.port}`);
})