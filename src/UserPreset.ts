import { ParameterSet } from "openscad-cli-wrapper";

export type UserPreset = {
  id: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  preset: ParameterSet;
};
