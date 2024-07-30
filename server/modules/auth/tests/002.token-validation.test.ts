// @ts-ignore
import { test, expect, describe } from "bun:test";
import { StatusCodes, supertest } from "../../../deps";

import app from "../../../app";
import { decryptAES } from "../../../utils/encryption.util";

describe("(Positive) Token Validation", () => {
  test("get info ...", async () => {
    await supertest(app)
      .get("/api/auth/token-validation")
      .set({
        origin: "foo",
        "x-browser-id": "bar",
        authorization: `Bearer ${process.env.SA_TOKEN}`,
      }) // wajib
      .then((response) => {
        const _encrypt_ = response.body?._encrypt_;
        const result = JSON.parse(decryptAES(_encrypt_, "foo#bar"));
        console.log({ result });
        expect(result?.message).toBe("get info");
        expect(result?.statusCode).toBe(StatusCodes.OK);
      });
  });
});

describe("(Negative) Token Validation", () => {
  test("no token ...", async () => {
    //
  });

  test("wrong token ...", async () => {
    //
  });

  test("token and jti deleted ...", async () => {
    //
  });
});
