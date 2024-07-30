/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ControllerResponse,
  ServiceRequest,
  User,
} from "../interfaces/server.interface.ts";
import { StatusCodes, NextFunction } from "../deps.ts";

import { jwtVerify } from "../utils/jwt.util.ts";

const use_token = async (
  req: ServiceRequest<any>,
  res: ControllerResponse,
  next: NextFunction
) => {
  req["token"] =
    (req.headers.authorization as string) ??
    (req.headers.token as string) ??
    (req.query?.authorization as string) ??
    (req.query?.token as string);
  if (!req["token"]) {
    return res.status(StatusCodes.FORBIDDEN).encrypt({
      message: "token is required!",
    });
  }

  try {
    req["user"] = (await jwtVerify(req["token"])) as User;
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).send(error.message);
  }

  return next();
};

export default use_token;
