import { ParameterKV, ParameterSet } from "openscad-cli-wrapper/dist/src/types/ParameterSet.js";

export interface IPresetRepository {
  getPresets(): ParameterSet;

  savePreset(name: string, paramKV: ParameterKV[]): void;

  saveAllPreset(parameterSet: ParameterSet): void;

  delPresets(value: string): void;
}
