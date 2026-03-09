import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, // disable SQL logs in console

    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test DB connection
export const connectDB = async () => {
  console.log("DB_NAME:", process.env.DB_NAME);
  console.log("DB_HOST:", process.env.DB_HOST);
  try {
    await sequelize.authenticate();
    console.log("Sequelize connected to MySQL ✅");
  } catch (error) {
    console.error("Sequelize connection error ❌:", error);
  }
};

export default sequelize;