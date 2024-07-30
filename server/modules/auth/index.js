import { express } from "../../deps";

// Middlewares
import CustomRequest from "../../middlewares/custom_request.middleware";
import UseToken from "../../middlewares/use_token.middleware";

// Controllers
import Register from "./controllers/register.controller";
import Login from "./controllers/login.controller";
import TokenValidation from "./controllers/token_validation.controller";

const router = express.Router();

router.post("/api/auth/register", CustomRequest, Register);
router.post("/api/auth/login", CustomRequest, Login);
router.get(
  "/api/auth/token-validation",
  CustomRequest,
  UseToken,
  TokenValidation
);

export default router;
