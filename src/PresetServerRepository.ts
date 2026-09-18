import { IPresetRepository } from "./IPresetRepository.js";
import { IPersistenceApi } from "./serverApi/IPersistenceApi";
import { ParameterSet } from "openscad-cli-wrapper/dist/src/types/ParameterSet.js";

export class PresetServerRepository implements IPresetRepository {
  constructor(private api: IPersistenceApi) {}
  async getPresets(): Promise<ParameterSet> {
    return (await this.api.getPresets()).preset;
  }

  async getPresetByName(name: string): Promise<Record<string, string> | null> {
    return (await this.getPresets()).parameterSets[name];
  }

  async savePreset(name: string, params: Record<string, string>): Promise<Record<string, string>> {
    return await this.api.savePreset(name, params);
  }

  async deletePreset(name: string): Promise<void> {
    return await this.api.deletePreset(name);
  }
}
