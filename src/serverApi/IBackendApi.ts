import { ParameterDefinition } from "openscad-cli-wrapper/dist/src/types/ParameterDefinition.js";

export interface IBackendApi {
  getParameterDefinition(): Promise<ParameterDefinition>;
}
