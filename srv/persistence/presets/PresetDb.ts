import { IParameterSet } from "laser-saber-customiser-commons/openscad/ParameterSet.js";

export type PresetDb = {
  id: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  preset: IParameterSet;
};
