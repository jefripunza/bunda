/* eslint-disable react-hooks/rules-of-hooks */
import { mongodb, StatusCodes } from "../../../deps";

import {
  ServiceRequest,
  ServiceResponse,
} from "../../../interfaces/server.interface";
import * as dto from "../../../../src/interfaces/auth/register.interface";

import { useMongoDB } from "../../../database";
import User from "../../../../src/models/user.model";
import Role from "../../../../src/models/role.model";

import { encode } from "../../../utils/encryption.util";

const RegisterService = async (
  req: ServiceRequest<dto.Ibody>
): Promise<ServiceResponse<dto.IResponse>> => {
  const { name, username, password, role_id } = req.body;

  // Check Username is Exist
  const isUsernameExist = await useMongoDB(async (db) => {
    const userCollection = db.collection<User>("users");
    const user = await userCollection.findOne({
      username,
    });
    if (!user) return false;
    return user;
  });
  if (!isUsernameExist.success) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "internal server error",
    };
  }
  if (isUsernameExist.result) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      message: "username is exist",
    };
  }

  // Check Role is Exist
  const isRoleExist = await useMongoDB(async (db) => {
    const roleCollection = db.collection<Role>("roles");
    const role = await roleCollection.findOne({
      _id: new mongodb.ObjectId(role_id),
    });
    if (!role) return false;
    return role;
  });
  if (!isRoleExist.success) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "internal server error",
    };
  }
  if (!isRoleExist.result) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      message: "role is not found",
    };
  }

  // Insert to Users
  await useMongoDB(async (db) => {
    const userCollection = db.collection<User>("users");
    await userCollection.insertOne({
      name,
      username,
      password: encode(password),
      role: new mongodb.ObjectId(role_id),
    });
  });

  return {
    statusCode: StatusCodes.OK,
    message: "register successfuly",
  };
};

export default RegisterService;
