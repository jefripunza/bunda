import { jwt, md5 } from "../deps";
import { SECRET_KEY } from "../environments";

interface JWTOptions {
  exp?: number;
}

export const jwtGenerate = async (payloads = {}, options: JWTOptions = {}) => {
  if (options?.exp) {
    payloads = {
      ...payloads,
      // minute (60s) * hour (60m) * day (24h) * month (30d) * year (365d)
      exp: options.exp, // (60 * 60) Expire dalam 1 jam
    };
  }
  const jti = crypto.randomUUID();
  payloads = {
    ...payloads,
    jti,
  };
  const privateKey = md5(SECRET_KEY);
  const token = jwt.sign(payloads, privateKey, { algorithm: "RS256" });
  return {
    token,
    jti,
  };
};
