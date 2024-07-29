/* eslint-disable @typescript-eslint/no-explicit-any */

import { StatusCodes } from "../../server/deps";

interface IResponse {
  statusCode: StatusCodes;
  message?: string;
  data?: any;
}

export default IResponse;
