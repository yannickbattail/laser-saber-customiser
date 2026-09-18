import { ParameterSet } from "openscad-cli-wrapper/dist/src/types/ParameterSet.js";

export interface IPresetRepository {
  getPresets(): Promise<ParameterSet>;
  getPresetByName(name: string): Promise<Record<string, string> | null>;
  savePreset(name: string, params: Record<string, string>): Promise<Record<string, string>>;
  deletePreset(name: string): Promise<void>;
}
