// config/sequelize.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config.js";

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".env") });

const env = process.env.NODE_ENV || "development";

export const sequelize = new Sequelize(
  process.env.DB_NAME || config[env].database,
  process.env.DB_USER || config[env].username,
  process.env.DB_PASS || config[env].password,
  {
    host: process.env.DB_HOST || config[env].host,
    dialect: config[env].dialect
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize Connected ✅");
  } catch (err) {
    console.error("Sequelize connection failed:", err);
  }
};
