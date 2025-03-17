import { NodeUpdate } from "./NodeUpdate.js";
import { ParameterKV } from "../commons/types/ParameterKV.js";
import { ParameterDefinition } from "laser-saber-customiser-commons/types/openscadParameterDefinition.js";
import { CustomiserForm } from "./CustomiserForm.js";

export class Gui {
  private lastFormChanged = 0;
  private changeTimeout = 2000;

  constructor() {
    this.init().then(() => {
      window.setInterval(() => {
        this.atInterval();
      }, 100);
    });
  }

  public formChanged() {
    this.lastFormChanged = Date.now();
    window.setTimeout(() => this.applyChanges(), this.changeTimeout + 50);
  }

  public async preview() {
    await this.getImage("preview");
  }

  public async animation() {
    await this.getImage("animation");
  }

  public async getImage(type: "preview" | "animation") {
    try {
      NodeUpdate.updateElement(
        "preview",
        `<img src="img/loading.webp" alt="loading" title="loading" />`,
      );
      const data = this.getFormData();
      const res = await fetch(`/api/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const uri = await this.imageBlobToBase64(await res.blob());
      NodeUpdate.updateElement(
        "preview",
        `<img src="${uri}" alt="${type}" title="${type}" />`,
      );
    } catch (e) {
      console.error(e);
      NodeUpdate.updateElement(
        "preview",
        `<img src="img/saber_empty.webp" alt="no preview" title="no preview" />`,
      );
    }
  }

  private async init() {
    const formParam: ParameterDefinition = (await (
      await fetch("/api/parameter")
    ).json()) as ParameterDefinition;
    const customiserForm = new CustomiserForm();
    NodeUpdate.updateElement("main", await customiserForm.initForm(formParam));
  }
  private atInterval() {
    this.refresh();
  }

  private refresh() {}

  private async applyChanges() {
    if (Date.now() - this.lastFormChanged > this.changeTimeout) {
      await this.preview();
    }
  }

  private getFormData() {
    const form = document.getElementById("form") as HTMLFormElement;
    const formData = new FormData(form);
    const data: ParameterKV[] = [];
    formData.forEach((value, key) => {
      data.push({ parameter: key, value: value as string });
    });
    return data;
  }

  private async imageBlobToBase64(blob: Blob) {
    return new Promise((onSuccess, onError) => {
      try {
        const reader = new FileReader();
        reader.onload = function () {
          onSuccess(this.result);
        };
        reader.readAsDataURL(blob);
      } catch (e) {
        onError(e);
      }
    });
  }
}
