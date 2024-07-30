/* eslint-disable @typescript-eslint/no-explicit-any */

export function isArray(value: any) {
  return value && typeof value == "object" && Array.isArray(value);
}
export function isObject(value: any) {
  return value && typeof value == "object" && !Array.isArray(value);
}

export function isInt(n: any) {
  return Number(n) === n && n % 1 === 0;
}

export function isFloat(n: any) {
  return Number(n) === n && n % 1 !== 0;
}
