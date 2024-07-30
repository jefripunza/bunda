import { express } from "../deps";

import AuthModule from "./auth";
// import UserModule from "./user";

const module = express.Router();

// Routes
module.use(AuthModule);
// app.use(UserModule);

export default module;
