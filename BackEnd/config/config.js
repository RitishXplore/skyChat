import dotenv from "dotenv";
dotenv.config();
export const  cred ={
    port : process.env.PORT,
    uri : process.env.DB_URL
}