import { StatusCodes } from "../../../deps";
import {
  ServiceRequest,
  ServiceResponse,
} from "../../../../src/interfaces/server.interface";
import * as dto from "../interfaces/login.interface";

const LoginService = async (
  req: ServiceRequest<dto.Ibody>
): Promise<ServiceResponse<dto.IResponse>> => {
  try {
    const { username, password } = req.body;

    const message_wrong_login = "username or password wrong";

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
