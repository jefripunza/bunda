import { StatusCodes } from "../../../deps";
import {
  ControllerRequest,
  ControllerResponse,
} from "../../../interfaces/server.interface";
import * as dto from "../interfaces/login.interface";
import LoginService from "../services/login.service";

const LoginController = async (
  req: ControllerRequest<dto.Ibody>,
  res: ControllerResponse
) => {
  try {
    const response = await LoginService(req);
    return res.status(response.statusCode).encrypt(response);
  } catch (err: unknown) {
    const error_message = (err as Error).message;
    console.log("on login :", { error_message });
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "internal server error",
    });
  }
};

export default LoginController;
