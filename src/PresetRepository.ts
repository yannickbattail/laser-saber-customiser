import { IPresetRepository } from "./IPresetRepository.js";
import { ParameterSet } from "openscad-cli-wrapper/dist/src/types/ParameterSet.js";

export class PresetRepository implements IPresetRepository {
  private static readonly key = "preset";

  getPresets(): ParameterSet {
    const pSet = JSON.parse(window.localStorage.getItem(PresetRepository.key) ?? "{}");
    return new ParameterSet(pSet);
  }

  getPresetByName(name: string): Record<string, string> | null {
    const presets = this.getPresets();
    if (name in presets.parameterSets) {
      return presets.parameterSets[name];
    }
    return null;
  }

  savePreset(name: string, params: Record<string, string>) {
    const pSet = JSON.parse(window.localStorage.getItem(PresetRepository.key) ?? "{}");
    const parameterSet = new ParameterSet(pSet);
    parameterSet.parameterSets[name] = params;
    this.saveAllPreset(parameterSet);
  }

  saveAllPreset(parameterSet: ParameterSet) {
    window.localStorage.setItem(PresetRepository.key, JSON.stringify(parameterSet, null, 2));
  }

  delPresets(value: string): void {
    const parameterSet = this.getPresets();
    parameterSet.del(value);
    this.saveAllPreset(parameterSet);
  }
}
