import { StatusCodes } from "../../../deps";

import {
  ControllerRequest,
  ControllerResponse,
} from "../../../interfaces/server.interface";
import * as dto from "../../../../src/interfaces/auth/token_validation.interface";

import TokenValidationService from "../services/token_validation.service";

const TokenValidationController = async (
  req: ControllerRequest<dto.Ibody>,
  res: ControllerResponse
) => {
  try {
    const response = await TokenValidationService(req);
    if (response.statusCode == StatusCodes.INTERNAL_SERVER_ERROR) {
      throw new Error(response.message);
    }
    return res.status(response.statusCode).encrypt(response);
  } catch (err: unknown) {
    const error_message = (err as Error).message;
    console.log("on token_validation :", { error_message });
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "internal server error",
    });
  }
};

export default TokenValidationController;
