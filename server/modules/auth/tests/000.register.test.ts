// @ts-ignore
import { test, expect, describe } from "bun:test";
import { StatusCodes, supertest } from "../../../deps";
import { useMongoDB } from "../../../database";
import { sa_user, a_user, c_user } from "../../../consts";

import app from "../../../app";
import { decryptAES, encryptAES } from "../../../utils/encryption.util";

describe("(Positive) Register", () => {
  test("Test (Super Admin) ...", async () => {
    await supertest(app)
      .post("/api/auth/register")
      .send({
        _encrypt_: encryptAES(
          JSON.stringify({
            name: sa_user.name,
            username: sa_user.username,
            password: sa_user.password,
            role_id: sa_user.role_id,
          }),
          "foo#bar"
        ),
      })
      .set({ origin: "foo", "x-browser-id": "bar" }) // wajib
      .then((response) => {
        const _encrypt_ = response.body?._encrypt_;
        const result = JSON.parse(decryptAES(_encrypt_, "foo#bar"));
        expect(result?.message).toBe("register successfuly");
        expect(result?.statusCode).toBe(StatusCodes.OK);
      });

    const isUserAvailable = await useMongoDB(async (db) => {
      const userCollection = db.collection("users");
      const users = await userCollection
        .find({
          username: sa_user.username,
        })
        .toArray();
      return users.length > 0;
    });
    expect(isUserAvailable.success).toBe(true);
    expect(isUserAvailable.result).toBe(true);
  });

  test("Extra (Admin) ...", async () => {
    await supertest(app)
      .post("/api/auth/register")
      .send({
        _encrypt_: encryptAES(
          JSON.stringify({
            name: a_user.name,
            username: a_user.username,
            password: a_user.password,
            role_id: a_user.role_id,
          }),
          "foo#bar"
        ),
      })
      .set({ origin: "foo", "x-browser-id": "bar" }) // wajib
      .then((response) => {
        const _encrypt_ = response.body?._encrypt_;
        const result = JSON.parse(decryptAES(_encrypt_, "foo#bar"));
        expect(result?.message).toBe("register successfuly");
        expect(result?.statusCode).toBe(StatusCodes.OK);
      });
  });

  test("Extra (Client) ...", async () => {
    await supertest(app)
      .post("/api/auth/register")
      .send({
        _encrypt_: encryptAES(
          JSON.stringify({
            name: c_user.name,
            username: c_user.username,
            password: c_user.password,
            role_id: c_user.role_id,
          }),
          "foo#bar"
        ),
      })
      .set({ origin: "foo", "x-browser-id": "bar" }) // wajib
      .then((response) => {
        const _encrypt_ = response.body?._encrypt_;
        const result = JSON.parse(decryptAES(_encrypt_, "foo#bar"));
        expect(result?.message).toBe("register successfuly");
        expect(result?.statusCode).toBe(StatusCodes.OK);
      });
  });
});

describe("(Negative) Register", () => {
  test("username exist ...", async () => {
    await supertest(app)
      .post("/api/auth/register")
      .send({
        _encrypt_: encryptAES(
          JSON.stringify({
            name: c_user.name,
            username: c_user.username,
            password: c_user.password,
            role_id: c_user.role_id,
          }),
          "foo#bar"
        ),
      })
      .set({ origin: "foo", "x-browser-id": "bar" }) // wajib
      .then((response) => {
        const _encrypt_ = response.body?._encrypt_;
        const result = JSON.parse(decryptAES(_encrypt_, "foo#bar"));
        expect(result?.message).toBe("username is exist");
        expect(result?.statusCode).toBe(StatusCodes.BAD_REQUEST);
      });
  });
});
