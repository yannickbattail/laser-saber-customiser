import { IBackendApi } from "./IBackendApi";
import { ParameterDefinition } from "openscad-cli-wrapper/dist/src/types/ParameterDefinition.js";

export class BackendApi implements IBackendApi {
  async getParameterDefinition(): Promise<ParameterDefinition> {
    const formParam: ParameterDefinition = (await (
      await fetch("/api/openscad/parameter")
    ).json()) as ParameterDefinition;
    return formParam as ParameterDefinition;
  }
}
