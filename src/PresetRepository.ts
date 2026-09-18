import { IPresetRepository } from "./IPresetRepository.js";
import { ParameterSet } from "openscad-cli-wrapper/dist/src/types/ParameterSet.js";

export class PresetRepository implements IPresetRepository {
  private static readonly key = "preset";

  async getPresets() {
    const pSet = JSON.parse(window.localStorage.getItem(PresetRepository.key) ?? "{}");
    return Promise.resolve(new ParameterSet(pSet));
  }

  async getPresetByName(name: string): Promise<Record<string, string> | null> {
    const presets = await this.getPresets();
    if (name in presets.parameterSets) {
      return Promise.resolve(presets.parameterSets[name]);
    }
    return Promise.resolve(null);
  }

  async savePreset(name: string, params: Record<string, string>): Promise<Record<string, string>> {
    const pSet = JSON.parse(window.localStorage.getItem(PresetRepository.key) ?? "{}");
    const parameterSet = new ParameterSet(pSet);
    parameterSet.parameterSets[name] = params;
    this.saveAllPreset(parameterSet);
    return Promise.resolve(params);
  }

  private saveAllPreset(parameterSet: ParameterSet) {
    window.localStorage.setItem(PresetRepository.key, JSON.stringify(parameterSet, null, 2));
  }

  async deletePreset(name: string): Promise<void> {
    const parameterSet = await this.getPresets();
    delete parameterSet.parameterSets[name];
    this.saveAllPreset(parameterSet);
    return Promise.resolve();
  }
}
