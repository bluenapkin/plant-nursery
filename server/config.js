import dotenv from "dotenv";
dotenv.config();

export const PORT                  = process.env.PORT;
export const DB_USER               = process.env.DB_USER;
export const DB_PASSWORD           = process.env.DB_PASSWORD;
export const DB_NAME               = process.env.DB_NAME;
export const DB_CLUSTER            = process.env.DB_CLUSTER;
export const CLIENT_URL            = process.env.CLIENT_URL;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY    = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;