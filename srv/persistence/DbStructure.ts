import { User } from "./User.js";
import { UserPreset } from "./presets/UserPreset.js";

export type DbStructure = {
  presets: UserPreset[];
  users: User[];
};
