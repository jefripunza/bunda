// @ts-ignore
import { test, expect, describe } from "bun:test";

import { SECRET_KEY } from "../environments";
import {
  encryptTripleDES,
  decryptTripleDES,
  //
  encryptAES,
  decryptAES,
  //
  encode,
  decode,
} from "../utils/encryption.util";

describe("Encryption", () => {
  test("normal TripleDES", async () => {
    const value = "OK";
    const encrypted = encryptTripleDES(value, SECRET_KEY);
    const decrypted = decryptTripleDES(encrypted, SECRET_KEY);
    expect(decrypted).toBe(value);
  });

  test("normal AES", async () => {
    const value = "OK";
    const encrypted = encryptAES(value, SECRET_KEY);
    const decrypted = decryptAES(encrypted, SECRET_KEY);
    expect(decrypted).toBe(value);
  });

  test("with combination", async () => {
    const value = "OK";
    const encrypted = encode(value);
    const decrypted = decode(encrypted);
    expect(decrypted).toBe(value);
  });
});
