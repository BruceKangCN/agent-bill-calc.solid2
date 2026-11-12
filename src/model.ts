import { type } from "arktype";

export const Model = type({
  name: type.string,
  input: type.number.narrow(isFinite),
  output: type.number.narrow(isFinite),
  "cache-read": type.number.narrow(isFinite),
  "cache-write": type.number.narrow(isFinite),
});

export const ModelTable = type({
  "[string]": Model,
});
