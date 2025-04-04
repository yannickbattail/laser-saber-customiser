import { UserPreset } from "./UserPreset.js";

export interface IPresetRepository {
  getAllPresets(): Promise<UserPreset[]>;

  DeletePreset(userId: string, presetName: string): Promise<void>;

  savePreset(userId: string, presetName: string, preset: Record<string, string>): Promise<UserPreset>;

  getUserPreset(userId: string): Promise<UserPreset>;
}
