import { isDEV, ServerPort } from "./env";

export const hostname = isDEV
  ? `http://${["localhost", ServerPort].join(":")}`
  : "";
