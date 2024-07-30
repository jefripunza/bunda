import { dotenv, path } from "./deps";
import { env_path } from "./consts";

dotenv.config({
  path: path.join(env_path),
});

/**
 * Semua default value wajib berbentuk String
 */

export const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";

export const SERVER_PORT = process.env.SERVER_PORT || "8080";

// Database (MongoDB)
export const MONGO_URL = () =>
  process.env.MONGO_URL_TEST ||
  process.env.MONGO_URL ||
  "mongodb://localhost:27017";
export const MONGO_NAME = () =>
  process.env.MONGO_NAME_TEST || process.env.MONGO_NAME || "example_bunda";

// Database (SQL)
export const DB_TYPE = process.env.DB_TYPE || "mysql";
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = process.env.DB_PORT || "3306";
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASS = process.env.DB_PASS || "";
export const DB_NAME = process.env.DB_NAME || "example";
