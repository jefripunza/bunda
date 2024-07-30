import { mongodb, path } from "./deps";

export const dirname = __dirname;

export const env_path = path.join(dirname, "..", ".env");

export const sa_user = {
  name: "Jefri Herdi Triyanto,S.T.,C.Me",
  username: "jefripunza",
  password: "plos1234",
  role_id: new mongodb.ObjectId(),
};
export const a_user = {
  name: "Aldiego Ardan",
  username: "diegosaurus",
  password: "plos1234",
  role_id: new mongodb.ObjectId(),
};
export const c_user = {
  name: "Watini",
  username: "watwet",
  password: "plos1234",
  role_id: new mongodb.ObjectId(),
};
