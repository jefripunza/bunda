/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, StatusCodes } from "../deps.ts";

import {
  ControllerResponse,
  ServiceRequest,
} from "../interfaces/server.interface.ts";

import { encryptAES, decryptAES } from "../utils/encryption.util.ts";

const collect = async (
  req: ServiceRequest<any>,
  res: ControllerResponse,
  next: NextFunction
) => {
  let origin = req.headers.origin || req.headers.host;
  if (!origin) {
    return res
      .status(StatusCodes.SERVICE_UNAVAILABLE)
      .send("cannot access direct");
  }
  if (String(origin).includes("://")) {
    origin = String(origin).split("://")[1];
  }
  const client_id = req.headers["x-browser-id"] || req.headers["x-mobile-id"];
  if (!client_id) {
    return res.status(StatusCodes.SERVICE_UNAVAILABLE).send("ID is required");
  }
  const secret_key_end_to_end = `${origin}#${client_id}`;

  if (typeof req.body?._encrypt_ == "string") {
    try {
      req.body = JSON.parse(
        decryptAES(req.body._encrypt_, secret_key_end_to_end)
      );
    } catch (error) {
      // skip...
    }
  }

  res.encrypt = (data) => {
    return res.json({
      _encrypt_: encryptAES(JSON.stringify(data), secret_key_end_to_end),
      //   data, // debug...
    });
  };
  return next();
};

export default collect;
