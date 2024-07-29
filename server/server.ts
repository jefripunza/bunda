import {
  express,
  Request,
  Response,
  NextFunction,
  Express,
  StatusCodes,
} from "./deps";
import { SERVER_PORT } from "./environments";

const app: Express = express();

app.use(express.json());

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

app.listen(SERVER_PORT, () => {
  console.log(
    `Server is up and running on port http://localhost:${SERVER_PORT}`
  );
});
