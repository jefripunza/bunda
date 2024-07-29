import { StatusCodes } from "../../../deps";
import {
  ServiceRequest,
  ServiceResponse,
} from "../../../interfaces/server.interface";
import * as dto from "../interfaces/login.interface";

const LoginService = async (
  req: ServiceRequest<dto.Ibody>
): Promise<ServiceResponse<dto.IResponse>> => {
  const { username, password } = req.body;
  try {
    return {
      statusCode: StatusCodes.OK,
      message: "login successfuly",
      data: {
        token: "",
      },
    };
  } catch (err: unknown) {
    const error_message = (err as Error).message;
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error_message,
    };
  }
};

export default LoginService;
