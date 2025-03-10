import fs from "node:fs";
import { execOutput } from "./execBash.js";
import { ParameterSet } from "../../commons/types/openscadParameterValues.js";
import { ParameterKV } from "../../commons/types/ParameterKV.js";

const ParameterSetFile = "generatedImages/ParameterSets.json";

export function getOpenscadParameters() {
  execOutput(
    `openscad-nightly --export-format param -o generatedImages/model_param.json openscadFiles/model.scad`,
  );
  const obj = JSON.parse(
    fs.readFileSync("generatedImages/model_param.json", "utf8"),
  );
  return obj;
  //return IsParameterListValid<ParameterKV[]>(obj);
}

export function generateOpenscadImage(ParameterSet: ParameterSet) {
  fs.writeFileSync(ParameterSetFile, JSON.stringify(ParameterSet, null, 2));
  const imgSize = "512,512";
  execOutput(
    `openscad-nightly -p ./${ParameterSetFile} -P model -o generatedImages/model.png --imgsize "${imgSize}" --view axes openscadFiles/model.scad`,
  );
  return "generatedImages/model.png";
}

export function generateOpenscadAnim(ParameterSet: ParameterSet) {
  fs.writeFileSync(ParameterSetFile, JSON.stringify(ParameterSet, null, 2));
  const imgNumber = 20;
  const imgDelay = 20;
  const imgSize = "512,512";
  execOutput(
    `openscad-nightly -p ./${ParameterSetFile} -P model -o generatedImages/model_anim.png -D "animation_rotation=true" --animate ${imgNumber} --imgsize "${imgSize}" --view axes openscadFiles/model.scad`,
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
