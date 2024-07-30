import { jwt, md5 } from "../deps";
import { SECRET_KEY } from "../environments";
import { User } from "../interfaces/server.interface";

/**
    HS256	HMAC using SHA-256 hash algorithm;
    HS384	HMAC using SHA-384 hash algorithm;
    HS512	HMAC using SHA-512 hash algorithm;
    RS256	RSASSA-PKCS1-v1_5 using SHA-256 hash algorithm; (asymmetric)
    RS384	RSASSA-PKCS1-v1_5 using SHA-384 hash algorithm; (asymmetric)
    RS512	RSASSA-PKCS1-v1_5 using SHA-512 hash algorithm; (asymmetric)
    PS256	RSASSA-PSS using SHA-256 hash algorithm (only node ^6.12.0 OR >=8.0.0); (asymmetric)
    PS384	RSASSA-PSS using SHA-384 hash algorithm (only node ^6.12.0 OR >=8.0.0); (asymmetric)
    PS512	RSASSA-PSS using SHA-512 hash algorithm (only node ^6.12.0 OR >=8.0.0); (asymmetric)
    ES256	ECDSA using P-256 curve and SHA-256 hash algorithm; (asymmetric)
    ES384	ECDSA using P-384 curve and SHA-384 hash algorithm; (asymmetric)
    ES512	ECDSA using P-521 curve and SHA-512 hash algorithm; (asymmetric)
 */
const use_algorithm = "HS512";

interface JWTOptions {
  exp?: number;
}

export const jwtGenerate = async (payloads = {}, options: JWTOptions = {}) => {
  if (options?.exp) {
    payloads = {
      ...payloads,
      // minute (60s) * hour (60m) * day (24h) * month (30d) * year (365d)
      exp: Math.floor(Date.now() / 1000) + options.exp, // (60 * 60) Expire dalam 1 jam
    };
  }
  const jti = crypto.randomUUID();
  payloads = {
    ...payloads,
    jti,
  };
  const privateKey = md5(SECRET_KEY);
  const token = jwt.sign(payloads, privateKey, { algorithm: use_algorithm });
  return {
    token,
    jti,
  };
};

export const jwtVerify = (authorization: string): User | boolean => {
  const token = String(authorization).replace("Bearer ", "");
  const privateKey = md5(SECRET_KEY);
  try {
    return jwt.verify(token, privateKey, {
      algorithms: [use_algorithm],
    }) as User;
  } catch (error) {
    console.log({ error });
    return false;
  }
};
