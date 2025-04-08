import { Db } from "../db.js";
import { UserPreset } from "./UserPreset.js";
import { IPresetRepository } from "./IPresetRepository.js";
import { nanoid } from "nanoid";
import { ParameterDefToZod } from "laser-saber-customiser-commons/openscad/DefinitionToZod.js";
import { getParameterDefinition } from "../../utils/getParameterDefinitionts.js";
import { modelFile } from "laser-saber-customiser-commons/openscad/OpenScadConfiguration.js";

export class PresetRepository implements IPresetRepository {
  public constructor(private readonly db: Db) {}

  async getPreset(userId: string): Promise<UserPreset | null> {
    return (
      (await this.db.getPresets()).find((p) => p.userId === userId) || null
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DeletePreset(presetDb: UserPreset): void {}

  async savePreset(
    userId: string,
    presetName: string,
    preset: Record<string, string>,
  ): Promise<UserPreset> {
    const zodPramDef = ParameterDefToZod(
      getParameterDefinition(modelFile).parameterDefinition,
    );
    zodPramDef.partial().parse(preset);
    const presetDb: UserPreset = await this.getOrCreate(userId);
    presetDb.preset.parameterSets[presetName] = preset;
    await this.db.save();
    return presetDb;
  }

  async getOrCreate(userId: string) {
    const presetDbs = await this.db.getPresets();
    const preset = presetDbs.find((p) => p.userId === userId);
    if (preset) {
      return preset;
    }
    const newPreset: UserPreset = {
      id: nanoid(),
      userId,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      preset: {
        fileFormatVersion: "1",
        parameterSets: {},
      },
    };
    presetDbs.push(newPreset);
    return newPreset;
  }
}
