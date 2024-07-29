/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response, StatusCodes } from "../deps";

export interface User {
  id: string;
  username: string;
  role: string;
  jti: string;
}

export interface ServiceRequest<Body> extends Request {
  token: string;
  user: User;
  body: Body;
}
export interface ServiceResponse<Data> {
  statusCode: StatusCodes;
  message?: string;
  data?: Data | undefined;
}

export interface ControllerRequest<Body> extends ServiceRequest<Body> {}
export interface ControllerResponse extends Response {
  statusCode: StatusCodes;
  encrypt: (data: any) => void;
}
