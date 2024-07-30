import {
  mime,
  express,
  Request,
  Response,
  NextFunction,
  Express,
  StatusCodes,
  morgan,
  helmet,
  cors,
} from "./deps";
import assets from "../assets";

import AuthModule from "./modules/auth";
// import UserModule from "./modules/user";

const app: Express = express();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// FrontEnd Handling
app.all("*", async (req: Request, res: Response, next: NextFunction) => {
  const { path } = req;
  if (String(path).startsWith("/api")) return next();
  let path_fix = path;
  if (path_fix == "/") {
    path_fix = "/index.html";
  }
  let match_file = assets[path_fix];
  if (!match_file) {
    path_fix = "/index.html";
    match_file = assets[path_fix];
  }
  function getMimeType(extension: string): string {
    const mimeTypes: { [key: string]: string } = {
      // tambah extension yang belum ada, di sini...
      ico: "image/x-icon",
      svg: "image/svg+xml",
    };
    return (
      mimeTypes[extension] ||
      mime.lookup(extension) ||
      "application/octet-stream"
    );
  }
  const mimeType = getMimeType(match_file.extension);
  const buffer = Buffer.from(match_file.content, "base64");
  res.setHeader("Content-Type", mimeType);
  return res.send(buffer);
});

// Routes
app.use(AuthModule);
// app.use(UserModule);

// Error Handling
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
