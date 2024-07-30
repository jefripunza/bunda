/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-ignore
import { test, expect, describe } from "bun:test";

import { jwtGenerate, jwtVerify } from "../utils/jwt.util";

describe("JWT", () => {
  const user = {
    name: "Jefri Herdi Triyanto",
    role: "superadmin",
    whatsapp: "https://wa.me/6282214252455",
  };
  let token = "";
  let jti = "";
  test("generate", async () => {
    const result = await jwtGenerate(user);
    expect(typeof result.token).toEqual("string");
    token = result.token;
    jti = result.jti;
  });

  test("verify", () => {
    const result: any = jwtVerify(token);
    expect(result.name).toEqual(user.name);
    expect(result.role).toEqual(user.role);
    expect(result.whatsapp).toEqual(user.whatsapp);
    expect(result.jti).toEqual(jti);
  });
});
