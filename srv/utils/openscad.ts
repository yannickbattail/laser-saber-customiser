import fs from "node:fs";
import { execOutput } from "./execBash.js";
import { ParameterSet } from "../../commons/types/openscadParameterValues.js";
import { ParameterKV } from "../../commons/types/ParameterKV.js";

class Configuration {
  openScadCmd: string;
  aminImgNumber: number;
  animDelay: number;
  animSize: number[];
  colorscheme: string;
  imgSize: number[];
  modelPrefix: string;
  modelDir: string;
  generationDir: string;

  constructor(cfg: Cfg) {
    Object.assign(this, cfg);
  }

  getParamFile() {
    return `${this.generationDir}/${this.modelPrefix}.param.json`;
  }

  getParamSetFile() {
    return `${this.generationDir}/${this.modelPrefix}.json`;
  }

  getScadFile() {
    return `${this.modelDir}/${this.modelPrefix}.scad`;
  }

  getImgFile() {
    return `${this.generationDir}/${this.modelPrefix}.png`;
  }

  getAnimFile() {
    return `${this.generationDir}/${this.modelPrefix}.webp`;
  }

  getAnimFiles() {
    return `${this.generationDir}/${this.modelPrefix}_anim.png`;
  }

  getAnimPattern() {
    return `${this.generationDir}/${this.modelPrefix}_anim*.png`;
  }
}

interface Cfg {
  openScadCmd: string;
  modelPrefix: string;
  modelDir: string;
  generationDir: string;
  aminImgNumber: number;
  animDelay: number;
  animSize: number[];
  colorscheme: string;
  imgSize: number[];
}

const cfg: Cfg = {
  openScadCmd: "openscad", //openscad-nightly
  modelPrefix: "model",
  modelDir: "openscadFiles",
  generationDir: "generatedImages",
  imgSize: [256, 512],
  animSize: [256, 512],
  aminImgNumber: 50,
  animDelay: 100,
  colorscheme: "DeepOcean",
};

const config: Configuration = new Configuration(cfg);

export function getOpenscadParameters() {
  execOutput(
    `${config.openScadCmd} --export-format param -o ${config.getParamFile()} ${config.getScadFile()}`,
  );
  const obj = JSON.parse(fs.readFileSync(config.getParamFile(), "utf8"));
  return obj;
  //return IsParameterListValid<ParameterKV[]>(obj);
}

export function generateOpenscadImage(parameterSet: ParameterSet) {
  fs.writeFileSync(
    config.getParamSetFile(),
    JSON.stringify(parameterSet, null, 2),
  );
  execOutput(
    `${config.openScadCmd} -p ./${config.getParamSetFile()} -P model -o ${config.getImgFile()} --imgsize "${config.imgSize.join(",")}" --colorscheme ${config.colorscheme} ${config.getScadFile()}`,
  );
  return config.getImgFile();
}

export function generateOpenscadAnim(ParameterSet: ParameterSet) {
  fs.writeFileSync(
    config.getParamSetFile(),
    JSON.stringify(ParameterSet, null, 2),
  );
  execOutput(
    `${config.openScadCmd} -p ./${config.getParamSetFile()} -P model -o ${config.getAnimFiles()} -D "animation_rotation=true" --animate ${config.aminImgNumber} --imgsize "${config.animSize.join(",")}" --colorscheme ${config.colorscheme} ${config.getScadFile()}`,
  );
  execOutput(
    `img2webp -o "${config.getAnimFile()}" -d "${config.animDelay}" ${config.getAnimPattern()}`,
  );
  execOutput(`rm ${config.getAnimPattern()}`);
  return config.getAnimFile();
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
