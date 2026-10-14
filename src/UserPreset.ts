import { ParameterSet } from "openscad-cli-wrapper/dist/src/types/ParameterSet.js";

export type UserPreset = {
  id: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  preset: ParameterSet;
};
