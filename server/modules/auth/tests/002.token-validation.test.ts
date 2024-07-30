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
        expect(result?.message).toBe("get info");
        expect(result?.statusCode).toBe(StatusCodes.OK);
        expect(typeof result?.data?.username).toBe("string");
        expect(typeof result?.data?.role).toBe("string");
        expect(typeof result?.data?.jti).toBe("string");
      });
  });
});

describe("(Negative) Token Validation", () => {
  test("no token ...", async () => {
    await supertest(app)
      .get("/api/auth/token-validation")
      .set({ origin: "foo", "x-browser-id": "bar" }) // wajib
      .expect(StatusCodes.FORBIDDEN)
      .then((response) => {
        const _encrypt_ = response.body?._encrypt_;
        const result = JSON.parse(decryptAES(_encrypt_, "foo#bar"));
        expect(result?.message).toBe("token is required!");
      });
  });

  test("wrong token ...", async () => {
    await supertest(app)
      .get("/api/auth/token-validation")
      .set({
        origin: "foo",
        "x-browser-id": "bar",
        authorization: `Bearer SA_TOKEN`,
      }) // wajib
      .expect(StatusCodes.UNAUTHORIZED)
      .then((response) => {
        const _encrypt_ = response.body?._encrypt_;
        const result = JSON.parse(decryptAES(_encrypt_, "foo#bar"));
        expect(result?.message).toBe("jwt malformed");
      });
  });

  test("token and jti deleted ...", async () => {
    //
  });
});
