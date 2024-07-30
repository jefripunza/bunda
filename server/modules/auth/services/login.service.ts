/* eslint-disable react-hooks/rules-of-hooks */
import { StatusCodes } from "../../../deps";

import {
  ServiceRequest,
  ServiceResponse,
} from "../../../interfaces/server.interface";
import * as dto from "../../../../src/interfaces/auth/login.interface";

import { useMongoDB } from "../../../database";
import User from "../../../../src/models/user.model";
import Role from "../../../../src/models/role.model";
import Revoke from "../../../../src/models/revoke.model";

import { decode } from "../../../utils/encryption.util";
import { jwtGenerate } from "../../../utils/jwt.util";

const LoginService = async (
  req: ServiceRequest<dto.Ibody>
): Promise<ServiceResponse<dto.IResponse>> => {
  const { username, password } = req.body;

  // Check if user is right ...
  const isLogin = await useMongoDB(async (db) => {
    const userCollection = db.collection<User>("users");
    const user = await userCollection.findOne({
      username,
    });
    if (!user) return false;
    if (password != decode(user.password)) return false;
    return user;
  });
  if (!isLogin.success) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "internal server error",
    };
  }
  if (!isLogin.result) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      message: "username or password wrong",
    };
  }
  const user = isLogin.result;

  // Check Limit Login ...
  const limit_login = 3;
  const isLimitLogin = await useMongoDB(async (db): Promise<boolean> => {
    const revokeCollection = db.collection<Revoke>("revokes");
    const revokes = await revokeCollection
      .find({
        user_id: user._id.toString(),
      })
      .toArray();
    return revokes.length >= limit_login;
  });
  if (!isLimitLogin.success) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "internal server error",
    };
  }
  if (isLimitLogin.result) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      message:
        "login is limit, please logout in other device and login again...",
    };
  }

  // Check Role is Active ?
  const isRoleActive = await useMongoDB(async (db): Promise<boolean> => {
    const roleCollection = db.collection<Role>("roles");
    const role = await roleCollection.findOne({
      _id: user.role,
    });
    if (!role) return false;
    if (typeof role.is_active == "boolean" && role.is_active == false)
      return false;
    return true;
  });
  if (!isRoleActive.success) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "internal server error",
    };
  }
  if (!isRoleActive.result) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      message: "role is not active",
    };
  }

  // Create Token ...
  const { token, jti } = await jwtGenerate({
    username,
    role: user.role.toString(),
  });

  // Insert to Revokes
  await useMongoDB(async (db) => {
    const revokeCollection = db.collection<Revoke>("revokes");
    await revokeCollection.insertOne({
      user_id: user._id.toString(),
      jwt_id: jti,
      login_at: new Date(),
      expired_at: new Date(),
    });
  });

  return {
    statusCode: StatusCodes.OK,
    message: "login successfuly",
    data: {
      token,
    },
  };
};

export default LoginService;
