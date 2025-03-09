import { ParameterSet } from "../openscadTypes";
import fs from "node:fs";
import { execBash } from "./execBash";
import { ParameterKV } from "../validation";

export function generateOpenscadImage(parameterSet: ParameterSet) {
  fs.writeFileSync(
    "openscadFiles/parameterSets.json",
    JSON.stringify(parameterSet, null, 2),
  );
  return execBash(
    "openscad-nightly -p ./openscadFiles/parameterSets.json -P model1 -o generatedImages/model1.png --view axes openscadFiles/model1.scad",
    {
      encoding: "utf-8",
      maxBuffer: 50 * 1024 * 1024,
      stdio: ["ignore", "inherit", "inherit"],
      neverFails: false,
    },
  );
}

export function buildParameterSet(input: ParameterKV[]) {
  const parameterSet: ParameterSet = {
    parameterSets: {
      model1: {},
    },
    fileFormatVersion: "1",
  };
  for (const param of input) {
    parameterSet.parameterSets["model1"][param.parameter] = param.value;
  }
  return parameterSet;
}
