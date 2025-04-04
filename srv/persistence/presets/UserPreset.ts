import { IParameterSet } from "laser-saber-customiser-commons/openscad/ParameterSet.js";

export type UserPreset = {
  id: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  preset: IParameterSet;
};
