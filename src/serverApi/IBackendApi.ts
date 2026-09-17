import {
  OpenScadOutputWithParameterDefinition,
  OpenScadOutputWithSummary,
} from "openscad-cli-wrapper/dist/src/types/OpenScadSummary";
import { ParameterKV } from "openscad-cli-wrapper/dist/src/types/ParameterSet";

export interface IBackendApi {
  getParameterDefinition(): Promise<OpenScadOutputWithParameterDefinition>;
  generateModel(data: ParameterKV[]): Promise<OpenScadOutputWithSummary>;
  generatePreview(data: ParameterKV[]): Promise<OpenScadOutputWithSummary>;
  generateAnimation(data: ParameterKV[]): Promise<OpenScadOutputWithSummary>;
}
