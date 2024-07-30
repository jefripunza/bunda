import {
  express,
  Request,
  Response,
  NextFunction,
  Express,
  StatusCodes,
} from "./deps";

import AuthModule from "./modules/auth";
// import UserModule from "./modules/user";

const app: Express = express();

// Middlewares
app.use(express.json());

// Routes
app.use(AuthModule);
// app.use(UserModule);

// Basic
app.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(StatusCodes.OK).json({
      message: "Hello World !!!",
      success: true,
    });
  } catch (error: unknown) {
    next(new Error((error as Error).message));
  }
});
app.get("*", (_req: Request, res: Response) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    message: "endpoint not found",
  });
});
app.all("*", (_req: Request, res: Response) => {
  return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
    message: "method not allowed",
  });
});

export default app;
