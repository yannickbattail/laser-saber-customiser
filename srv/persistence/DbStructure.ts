import { User } from "./User.js";
import { PresetDb } from "./presets/PresetDb.js";

export type DbStructure = {
  presets: PresetDb[];
  users: User[];
};
