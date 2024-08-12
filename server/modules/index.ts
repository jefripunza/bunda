import { express } from "../deps";

import AuthModule from "./auth";
// import UserModule from "./user";
// import ProductModule from "./product";
// import BaseModule from "./base";

const module = express.Router();

// Routes
module.use(AuthModule);
// app.use(UserModule);

export default module;
