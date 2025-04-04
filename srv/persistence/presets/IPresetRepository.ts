import { PresetDb } from "./PresetDb.js";

export interface IPresetRepository {
  getPreset(userId: string): Promise<PresetDb | null>;

  savePreset(
    userId: string,
    presetName: string,
    preset: Record<string, string>,
  ): Promise<PresetDb>;

  DeletePreset(presetDb: PresetDb): void;
}
