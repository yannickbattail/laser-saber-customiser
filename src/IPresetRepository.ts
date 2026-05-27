import { ParameterKV, ParameterSet } from "openscad-cli-wrapper";

export interface IPresetRepository {
  getPresets(): ParameterSet;
  savePreset(name: string, paramKV: ParameterKV[]): void;
  saveAllPreset(parameterSet: ParameterSet): void;
  delPresets(value: string): void;
}
