import fs from "node:fs";
import { execOutput } from "./execBash.js";
import { ParameterSet } from "../../commons/types/openscadParameterValues.js";
import { ParameterKV } from "../../commons/types/ParameterKV.js";

class Configuration {
  openScadCmd: string;
  f3dCmd: string;
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

  get3DFile() {
    return `../src/gen/${this.modelPrefix}.3mf`;
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
  f3dCmd: string;
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
  f3dCmd: "f3d", //openscad-nightly
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

type Option3mf = {
  color_mode: "model" | "none" | "selected_only";
  unit: "micron" | "millimeter" | "centimeter" | "meter" | "inch" | "foot";
  color: string;
  material_type: "color" | "basematerial";
  decimal_precision:
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "13"
    | "14"
    | "15"
    | "16";
  add_meta_data: "true" | "false";
  meta_data_title: string;
  meta_data_designer: string;
  meta_data_description: string;
  meta_data_copyright: string;
  meta_data_license_terms: string;
  meta_data_rating: string;
};

export function generateOpenscad3DModel(parameterSet: ParameterSet) {
  fs.writeFileSync(
    config.getParamSetFile(),
    JSON.stringify(parameterSet, null, 2),
  );
  const opt3mf: Option3mf = {
    color_mode: "model",
    material_type: "color",
    color: "",
    unit: "millimeter",
    decimal_precision: "6",
    add_meta_data: "false",
    meta_data_title: "light saber",
    meta_data_description: "Customisable light saber",
    meta_data_copyright: "Xcinnay",
    meta_data_designer: "Xcinnay",
    meta_data_license_terms: "",
    meta_data_rating: "",
  };
  const str3mf = Object.entries(opt3mf)
    .map(
      ([key, value]) =>
        `-O 'export-3mf/${key.replace("_", "-")}=${value.replace("'", "\\'")}'`,
    )
    .join(" ");
  execOutput(
    `${config.openScadCmd} -p ./${config.getParamSetFile()} -P model ${str3mf} --enable all --backend Manifold -o ${config.get3DFile()} ${config.getScadFile()}`,
  );
  return config.get3DFile();
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

export function generateF3dImage(parameterSet: ParameterSet) {
  const model3d = generateOpenscad3DModel(parameterSet);
  fs.writeFileSync(
    config.getParamSetFile(),
    JSON.stringify(parameterSet, null, 2),
  );
  const f3d_hdri = "";
  // const f3d_hdri="--hdri-skybox --hdri-ambient --hdri-file=./tests/sky.jpg"; // -u
  const f3d_colors = "";
  // const f3d_colors = "--bg-color 0.9,0.8,1 --color 0.3,0.3,1";
  const f3d_material = "";
  // const f3d_material = "--roughness=0.5 --metallic=1";
  const f3d_debug = ""; // {debug, info, warning, error, quiet}
  // const f3d_debug="--verbose=info"
  execOutput(
    `${config.f3dCmd} ${f3d_debug} --resolution ${config.imgSize.join(",")} ${f3d_colors} -q -a -t --axis=false --grid=false --filename=false ${f3d_material} ${f3d_hdri} --output ${config.getImgFile()} ${model3d}`,
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
