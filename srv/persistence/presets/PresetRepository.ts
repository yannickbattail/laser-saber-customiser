import { Db } from "../db.js";
import { PresetDb } from "./PresetDb.js";
import { IPresetRepository } from "./IPresetRepository.js";
import { nanoid } from "nanoid";

export class PresetRepository implements IPresetRepository {
  public constructor(private readonly db: Db) {}

  async getPreset(userId: string): Promise<PresetDb | null> {
    return (
      (await this.db.getPresets()).find((p) => p.userId === userId) || null
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DeletePreset(presetDb: PresetDb): void {}

  async savePreset(
    userId: string,
    presetName: string,
    preset: Record<string, string>,
  ): Promise<PresetDb> {
    const presetDbs = await this.db.getPresets();
    const presetDb: PresetDb = presetDbs.find((p) => p.userId === userId) || {
      id: nanoid(),
      userId,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      preset: {
        fileFormatVersion: "1",
        parameterSets: {},
      },
    };
    presetDb.preset.parameterSets[presetName] = preset;
    await this.db.save();
    return presetDb;
  }
}
