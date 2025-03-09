import { ParameterSet } from "./openscadTypes.js";
import fs from "node:fs";
import { execOutput } from "./execBash.js";
import { ParameterKV, IsParameterKvValid } from "./validation.js";

const parameterSetFile = "generatedImages/parameterSets.json";

export function getOpenscadParameters() {
  execOutput(
    `openscad-nightly --export-format param -o generatedImages/model_pram.json openscadFiles/model.scad`,
  );
  const obj = JSON.parse(
    fs.readFileSync("generatedImages/model_pram.json", "utf8"),
  );
  const input = IsParameterKvValid<ParameterKV[]>(obj);
  return input;
}

export function generateOpenscadImage(parameterSet: ParameterSet) {
  fs.writeFileSync(parameterSetFile, JSON.stringify(parameterSet, null, 2));
  const imgSize = "512,512";
  execOutput(
    `openscad-nightly -p ./${parameterSetFile} -P model -o generatedImages/model.png --imgsize "${imgSize}" --view axes openscadFiles/model.scad`,
  );
  return "generatedImages/model.png";
}

export function generateOpenscadAnim(parameterSet: ParameterSet) {
  fs.writeFileSync(parameterSetFile, JSON.stringify(parameterSet, null, 2));
  const imgNumber = 20;
  const imgDelay = 20;
  const imgSize = "512,512";
  execOutput(
    `openscad-nightly -p ./${parameterSetFile} -P model -o generatedImages/model_anim.png -D "animation_rotation=true" --animate ${imgNumber} --imgsize "${imgSize}" --view axes openscadFiles/model.scad`,
  );
  execOutput(
    `img2webp -o "generatedImages/model.webp" -d "${imgDelay}0" generatedImages/model_anim*.png`,
  );
  execOutput(`rm generatedImages/model_anim*.png`);
  return "generatedImages/model.webp";
}

export function buildParameterSet(input: ParameterKV[]): ParameterSet {
  const parameterSet: ParameterSet = {
    parameterSets: {
      model: {},
    },
    fileFormatVersion: "1",
  };
  for (const param of input) {
    parameterSet.parameterSets["model"][param.parameter] = param.value;
  }
  return parameterSet;
}

export interface OptionNumber {
  name: string;
  value: number;
}

export interface OptionString {
  name: string;
  value: string;
}

export interface ParameterBase {
  name: string;
  caption?: string;
  group?: string;
}

export interface ParameterNumber extends ParameterBase {
  type: "number";
  initial: number | number[];
  options?: OptionNumber[];
  max?: number;
  min?: number;
  step?: number;
}

export interface ParameterString extends ParameterBase {
  type: "string";
  initial: string;
  options?: OptionString[];
  maxLength?: number;
}

export interface ParameterBoolean extends ParameterBase {
  type: "boolean";
  initial: boolean;
}

export interface ParameterList {
  parameters: (ParameterNumber | ParameterString | ParameterBoolean)[];
  title: string;
}
