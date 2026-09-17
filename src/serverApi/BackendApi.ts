import {
  OpenScadOutputWithParameterDefinition,
  OpenScadOutputWithSummary,
} from "openscad-cli-wrapper/dist/src/types/OpenScadSummary";
import { ParameterKV } from "openscad-cli-wrapper/dist/src/types/ParameterSet.js";
import { IBackendApi } from "./IBackendApi";

export class BackendApi implements IBackendApi {
  async getParameterDefinition(): Promise<OpenScadOutputWithParameterDefinition> {
    const formParam: OpenScadOutputWithParameterDefinition = (await (
      await fetch("/api/openscad/parameter")
    ).json()) as OpenScadOutputWithParameterDefinition;
    return formParam as OpenScadOutputWithParameterDefinition;
  }

  async generateModel(data: ParameterKV[]) {
    const res = await fetch(`/api/openscad/3DModel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return (await res.json()) as OpenScadOutputWithSummary;
  }

  async generatePreview(data: ParameterKV[]): Promise<OpenScadOutputWithSummary> {
    return this.generateImage(data, "/api/openscad/animation");
  }
  async generateAnimation(data: ParameterKV[]): Promise<OpenScadOutputWithSummary> {
    return this.generateImage(data, "/api/openscad/preview");
  }

  private async generateImage(data: ParameterKV[], url: string): Promise<OpenScadOutputWithSummary> {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return (await res.json()) as OpenScadOutputWithSummary;
  }
}
