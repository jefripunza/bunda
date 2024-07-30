import { crypto } from "../deps";
import { SECRET_KEY } from "../environments";

// -------------------------------------------------------------------
// -------------------------------------------------------------------

function hashKey(key: string, length: number) {
  const hasher = crypto.createHash("sha256");
  const hashed = hasher.update(key).digest();
  return hashed.slice(0, length);
}

function reverseString(str: string) {
  return str.split("").reverse().join("");
}

// -------------------------------------------------------------------
// -------------------------------------------------------------------
// -------------------------------------------------------------------
// -------------------------------------------------------------------

export const encryptTripleDES = (plaintext: string, SECRET_KEY: string) => {
  const key = hashKey(SECRET_KEY, 24);
  const cipher = crypto.createCipheriv("des-ede3-cbc", key, key.slice(0, 8));
  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};

export const decryptTripleDES = (ciphertext: string, SECRET_KEY: string) => {
  const key = hashKey(SECRET_KEY, 24);
  const decipher = crypto.createDecipheriv(
    "des-ede3-cbc",
    key,
    key.slice(0, 8)
  );
  let decrypted = decipher.update(ciphertext, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// -------------------------------------------------------------------

export const encryptAES = (plaintext: string, secret_key: string) => {
  const key = hashKey(secret_key, 32);
  const iv = hashKey(secret_key, 16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};
export const decryptAES = (ciphertext: string, secret_key: string) => {
  const key = hashKey(secret_key, 32);
  const iv = hashKey(secret_key, 16);
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(ciphertext, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// -------------------------------------------------------------------
// -------------------------------------------------------------------
// -------------------------------------------------------------------
// -------------------------------------------------------------------

function encryptMethod(plainText: string, key: string) {
  return encryptTripleDES(plainText, key);
  // return encryptAES(plainText, key);
}
function decryptMethod(cipherText: string, key: string) {
  return decryptTripleDES(cipherText, key);
  // return decryptAES(cipherText, key);
}

// -------------------------------------------------------------------
// -------------------------------------------------------------------
// -------------------------------------------------------------------
// -------------------------------------------------------------------

const debug = false;

export const encode = (text: string) => {
  // Layer 1: AES Encryption with original hashed key
  let encrypted = encryptMethod(text, SECRET_KEY);
  if (debug) console.log("nodejs encode layer 1:", encrypted);

  // Layer 2: AES Encryption with reversed hashed key
  const reversedKey = reverseString(SECRET_KEY);
  encrypted = encryptMethod(encrypted, reversedKey);
  if (debug) console.log("nodejs encode layer 2:", encrypted);

  // Layer 3: AES Encryption with first half of the original hashed key rehashed
  const firstHalfKey = SECRET_KEY.slice(0, SECRET_KEY.length / 2);
  encrypted = encryptMethod(encrypted, firstHalfKey);
  if (debug) console.log("nodejs encode layer 3:", encrypted);

  // Layer 4: AES Encryption with second half of the original hashed key rehashed
  const secondHalfKey = SECRET_KEY.slice(SECRET_KEY.length / 2);
  encrypted = encryptMethod(encrypted, secondHalfKey);
  if (debug) console.log("nodejs encode layer 4:", encrypted);

  // Layer 5: Base64 encode
  encrypted = Buffer.from(encrypted).toString("base64");
  if (debug) console.log("nodejs encode layer 5:", encrypted);

  return encrypted;
};

export const decode = (encodedText: string) => {
  // Layer 5: Base64
  let decrypted = Buffer.from(encodedText, "base64").toString("ascii");
  if (debug) console.log("nodejs decode layer 5:", decrypted);

  // Layer 4: AES Decryption with second half of the original hashed key rehashed
  const secondHalfKey = SECRET_KEY.slice(SECRET_KEY.length / 2);
  decrypted = decryptMethod(decrypted, secondHalfKey);
  if (debug) console.log("nodejs decode layer 4:", decrypted);

  // Layer 3: AES Decryption with first half of the original hashed key rehashed
  const firstHalfKey = SECRET_KEY.slice(0, SECRET_KEY.length / 2);
  decrypted = decryptMethod(decrypted, firstHalfKey);
  if (debug) console.log("nodejs decode layer 3:", decrypted);

  // Layer 2: AES Decryption with reversed hashed key
  const reversedKey = reverseString(SECRET_KEY);
  decrypted = decryptMethod(decrypted, reversedKey);
  if (debug) console.log("nodejs decode layer 2:", decrypted);

  // Layer 1: AES Decryption with original hashed key
  decrypted = decryptMethod(decrypted, SECRET_KEY);
  if (debug) console.log("nodejs decode layer 1:", decrypted);

  return decrypted.trim();
};
