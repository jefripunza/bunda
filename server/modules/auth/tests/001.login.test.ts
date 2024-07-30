/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
// @ts-ignore
import { test, expect, describe } from "bun:test";
import { StatusCodes, supertest } from "../../../deps";
import { jwtVerify } from "../../../utils/jwt.util";
import { sa_user, a_user, c_user } from "../../../consts";
import { useMongoDB } from "../../../database";
import app from "../../../app";
import { decryptAES, encryptAES } from "../../../utils/encryption.util";

describe("(Positive) Login", () => {
  test("Test (Super Admin) ...", async () => {
    await supertest(app)
      .post("/api/auth/login")
      .send({
        _encrypt_: encryptAES(
          JSON.stringify({
            username: sa_user.username,
            password: sa_user.password,
          }),
          "foo#bar"
        ),
      })
      .set({ origin: "foo", "x-browser-id": "bar" }) // wajib
      .then((response) => {
        const _encrypt_ = response.body?._encrypt_;
        const result = JSON.parse(decryptAES(_encrypt_, "foo#bar"));
        const sa_token = result.data?.token;
        expect(result?.message).toBe("login successfuly");
        expect(result?.statusCode).toBe(StatusCodes.OK);
        expect(typeof sa_token).toBe("string");
        process.env.SA_TOKEN = sa_token;
      });

    // verify JWT...
    const result: any = jwtVerify(process.env.SA_TOKEN as string);
    const jti = result.jti;
    expect(result.username).toBe(sa_user.username);

    const isJtiAvailable = await useMongoDB(async (db) => {
      const revokeCollection = db.collection("revokes");
      const revoke = await revokeCollection.findOne({
        jwt_id: jti,
      });
      if (!revoke) return false;
      return true;
    });
    expect(isJtiAvailable.success).toBe(true);
    expect(isJtiAvailable.result).toBe(true);
  });

  test("Extra (Admin) ...", async () => {
    await supertest(app)
      .post("/api/auth/login")
      .send({
        _encrypt_: encryptAES(
          JSON.stringify({
            username: a_user.username,
            password: a_user.password,
          }),
          "foo#bar"
        ),
      })
      .set({ origin: "foo", "x-browser-id": "bar" }) // wajib
      .then((response) => {
        const _encrypt_ = response.body?._encrypt_;
        const result = JSON.parse(decryptAES(_encrypt_, "foo#bar"));
        const a_token = result.data?.token;
        expect(result?.message).toBe("login successfuly");
        expect(result?.statusCode).toBe(StatusCodes.OK);
        expect(typeof a_token).toBe("string");
        process.env.A_TOKEN = a_token;
      });
  });

  test("Extra (Client) ...", async () => {
    await supertest(app)
      .post("/api/auth/login")
      .send({
        _encrypt_: encryptAES(
          JSON.stringify({
            username: c_user.username,
            password: c_user.password,
          }),
          "foo#bar"
        ),
      })
      .set({ origin: "foo", "x-browser-id": "bar" }) // wajib
      .then((response) => {
        const _encrypt_ = response.body?._encrypt_;
        const result = JSON.parse(decryptAES(_encrypt_, "foo#bar"));
        const c_token = result.data?.token;
        expect(result?.message).toBe("login successfuly");
        expect(result?.statusCode).toBe(StatusCodes.OK);
        expect(typeof c_token).toBe("string");
        process.env.C_TOKEN = c_token;
      });
  });
});

describe("(Negative) Login", () => {
  test("wrong username ...", async () => {
    //
  });

  test("wrong password ...", async () => {
    //
  });

  test("user not register ...", async () => {
    //
  });
});
