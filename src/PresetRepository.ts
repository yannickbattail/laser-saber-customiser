import {
  ParameterKV,
  ParameterSet,
} from "laser-saber-customiser-commons/openscad/ParameterSet.js";
import { IPresetRepository } from "./IPresetRepository.js";

export class PresetRepository implements IPresetRepository {
  getPresets(): ParameterSet {
    const pSet = JSON.parse(window.localStorage.getItem("preset") ?? "{}");
    return new ParameterSet(pSet);
  }

  savePreset(name: string, paramKV: ParameterKV[]) {
    const pSet = JSON.parse(window.localStorage.getItem("preset") ?? "{}");
    const parameterSet = new ParameterSet(pSet);
    parameterSet.add(name, paramKV);
    window.localStorage.setItem("preset", JSON.stringify(parameterSet));
  }
}
