import { type } from "arktype";
import { parse } from "smol-toml";

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

export const fetchModels = async () => {
  const resp = await fetch("/models.toml");
  const content = await resp.text();
  const data = parse(content);
  const models = ModelTable.assert(data);

  return models;
};
