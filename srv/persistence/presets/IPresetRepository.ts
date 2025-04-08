import { UserPreset } from "./UserPreset.js";

export interface IPresetRepository {
  getPreset(userId: string): Promise<UserPreset | null>;

  savePreset(
    userId: string,
    presetName: string,
    preset: Record<string, string>,
  ): Promise<UserPreset>;

  DeletePreset(presetDb: UserPreset): void;
}
