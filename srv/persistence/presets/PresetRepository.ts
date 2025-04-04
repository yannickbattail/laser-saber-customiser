import { Db } from "../db.js";
import { UserPreset } from "./UserPreset.js";
import { IPresetRepository } from "./IPresetRepository.js";
import { nanoid } from "nanoid";
import { ParameterSet } from "openscad-cli-wrapper";

export class PresetRepository implements IPresetRepository {
  public constructor(private readonly db: Db) {}

  async getAllPresets(): Promise<UserPreset[]> {
    return await this.db.getPresets();
  }

  async DeletePreset(userId: string, presetName: string): Promise<void> {
    const presets: UserPreset = await this.getUserPreset(userId);
    delete presets.preset.parameterSets[presetName];
    await this.db.save();
  }

  async savePreset(userId: string, presetName: string, preset: Record<string, string>): Promise<UserPreset> {
    const presets: UserPreset = await this.getUserPreset(userId);
    presets.preset.parameterSets[presetName] = preset;
    await this.db.save();
    return presets;
  }

  async getUserPreset(userId: string): Promise<UserPreset> {
    const presetDbs = await this.db.getPresets();
    const preset = presetDbs.find((p) => p.userId === userId);
    if (preset) {
      return preset;
    }
    return await this.newUserPreset(userId);
  }

  private async newUserPreset(userId: string): Promise<UserPreset> {
    const presetDbs = await this.db.getPresets();
    const newPreset: UserPreset = {
      id: nanoid(),
      userId,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      preset: {
        fileFormatVersion: "1",
        parameterSets: {},
      } as ParameterSet,
    };
    presetDbs.push(newPreset);
    await this.db.save();
    return newPreset;
  }
}
