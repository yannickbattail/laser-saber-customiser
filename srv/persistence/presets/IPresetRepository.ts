import { UserPreset } from "./UserPreset.js";

export interface IPresetRepository {
  getAllPresets(): Promise<UserPreset[]>;
  getPresets(userId: string): Promise<UserPreset>;
  savePreset(userId: string, presetName: string, preset: Record<string, string>): Promise<Record<string, string>>;
  deletePreset(userId: string, presetName: string): Promise<void>;
}
