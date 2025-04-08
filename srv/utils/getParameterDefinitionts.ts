import { OpenScad } from "laser-saber-customiser-commons/openscad/OpenScad.js";
import { getOptions } from "laser-saber-customiser-commons/openscad/OpenScadConfiguration.js";
import { execOutput } from "./execBash.js";
import { OpenScadOutputWithParameterDefinition } from "laser-saber-customiser-commons/openscad/OpenScadOutput.js";

const cache = new Map<string, OpenScadOutputWithParameterDefinition>();

export function getParameterDefinition(
  modelFile: string,
): OpenScadOutputWithParameterDefinition {
  if (cache.has(modelFile)) {
    return cache.get(modelFile) as OpenScadOutputWithParameterDefinition;
  }
  const openscad = new OpenScad(modelFile, getOptions(), execOutput);
  const param = openscad.getParameterDefinition();
  cache.set(modelFile, param);
  return param;
}
