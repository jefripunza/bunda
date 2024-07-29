import { dotenv, path } from "./deps";
import { env_path } from "./consts";

dotenv.config({
  path: path.join(env_path),
});

export const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";
export const SERVER_PORT = process.env.SERVER_PORT || 8080;
