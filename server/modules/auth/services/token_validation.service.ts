/* eslint-disable react-hooks/rules-of-hooks */
import { StatusCodes } from "../../../deps";

import {
  ServiceRequest,
  ServiceResponse,
} from "../../../interfaces/server.interface";
import * as dto from "../../../../src/interfaces/auth/token_validation.interface";

const TokenValidationService = async (
  req: ServiceRequest<dto.Ibody>
): Promise<ServiceResponse<dto.IResponse>> => {
  return {
    statusCode: StatusCodes.OK,
    message: "get info",
    data: req.user,
  };
};

export default TokenValidationService;
