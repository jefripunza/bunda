import { express } from "../../deps";

// Middlewares
import CustomRequest from "../../middlewares/custom_request.middleware";
import UseToken from "../../middlewares/use_token.middleware";

// Controllers

const router = express.Router();

// add product to cart
// delete product on cart
// change qty product
// add comment on product in cart

export default router;
