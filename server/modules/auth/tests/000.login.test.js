// @ts-ignore
import { expect, test } from "bun:test";
import LoginService from "../services/login.service";

test("on Login...", async () => {
  const response = await LoginService({
    body: {
      username: "",
      password: "",
    },
  });
  console.log({ response });
  expect(4 + 4).toBe(8);
});
