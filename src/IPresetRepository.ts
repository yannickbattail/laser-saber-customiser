import { ParameterSet } from "openscad-cli-wrapper/dist/src/types/ParameterSet.js";

export interface IPresetRepository {
  getPresets(): ParameterSet;

  getPresetByName(name: string): Record<string, string> | null;

  savePreset(name: string, params: Record<string, string>): void;

  saveAllPreset(parameterSet: ParameterSet): void;

  delPresets(value: string): void;
}
