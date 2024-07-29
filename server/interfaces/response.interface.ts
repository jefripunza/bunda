/* eslint-disable @typescript-eslint/no-explicit-any */

import { StatusCodes } from "../deps";

interface IResponse {
  statusCode: StatusCodes;
  message?: string;
  data?: any;
}

export default IResponse;
