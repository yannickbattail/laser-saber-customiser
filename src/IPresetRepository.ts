import {
  ParameterKV,
  ParameterSet,
} from "laser-saber-customiser-commons/openscad/ParameterSet.js";

export interface IPresetRepository {
  getPresets(): ParameterSet;

  savePreset(name: string, paramKV: ParameterKV[]): void;

  saveAllPreset(parameterSet: ParameterSet): void;

  delPresets(value: string): void;
}
