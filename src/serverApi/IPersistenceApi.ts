import { UserPreset } from "../UserPreset";

export interface IPersistenceApi {
  getPresets(): Promise<UserPreset>;
  savePreset(name: string, preset: Record<string, string>): Promise<Record<string, string>>;
  deletePreset(name: string): Promise<void>;
}
