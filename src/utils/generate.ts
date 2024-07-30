export { v4 as uuidv4 } from "uuid";

const all_characters =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
const number_characters = "1234567890";
const specific_characters = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

const generate = (characters: string, length: number) => {
  let result = "";
  while (result.length < length) {
    const new_char = characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
    if (!result.includes(new_char)) {
      result += new_char;
    }
  }
  return result;
};

export const all = (length = 6) => generate(all_characters, length);
export const number = (length = 6) => generate(number_characters, length);
export const captcha = (length = 6) => generate(specific_characters, length);
export const OTP = (length = 4) => generate(specific_characters, length);

export const randomNumber = (min = 1, max = 10) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};
