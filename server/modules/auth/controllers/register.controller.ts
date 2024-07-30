import { StatusCodes } from "../../../deps";

import {
  ControllerRequest,
  ControllerResponse,
} from "../../../interfaces/server.interface";
import * as dto from "../../../../src/interfaces/auth/register.interface";

import RegisterService from "../services/register.service";

const RegisterController = async (
  req: ControllerRequest<dto.Ibody>,
  res: ControllerResponse
) => {
  try {
    const response = await RegisterService(req);
    if (response.statusCode == StatusCodes.INTERNAL_SERVER_ERROR) {
      throw new Error(response.message);
    }
    return res.status(response.statusCode).encrypt(response);
  } catch (err: unknown) {
    const error_message = (err as Error).message;
    console.log("on register :", { error_message });
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "internal server error",
    });
  }
};

export default RegisterController;
