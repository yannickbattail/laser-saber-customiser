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

  public changePart(me: HTMLSelectElement | null) {
    if (!me) return;
    const group = `${me.id} : ${me.value}`;
    document
      .querySelectorAll(`[id^="toggleTitle_${me.id} : "]`)
      .forEach((e) => {
        e.classList.add("toggleHide");
        e.classList.remove("toggleShow");
      });
    document
      .getElementById(`toggleTitle_${group}`)
      ?.classList?.add("toggleShow");
    document
      .getElementById(`toggleTitle_${group}`)
      ?.classList?.remove("toggleHide");
  }

  public async preview() {
    await this.getImage("preview");
  }

  public async renderedImage() {
    await this.getImage("renderedImage");
  }

  public async animation() {
    await this.getImage("animation");
  }

  public async display3DModel() {
    try {
      NodeUpdate.updateElement(
        "preview",
        `<img class="previewImage loadingImage" src="img/loading.webp" alt="loading" title="loading" />`,
      );
      const data = this.getFormData();
      const res = await fetch(`/api/3DModel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const divPreview = document.getElementById("preview");
      if (divPreview) divPreview.innerHTML = "";
      const uri = await res.json();
      // @ts-expect-error in js
      new StlViewer(divPreview, {
        models: [
          {
            id: 0,
            filename: uri,
            rotationx: Math.PI / -2,
          },
        ],
        auto_rotate: true,
        zoom: 600,
        allow_drag_and_drop: false,
        jszip_path: "../../lib/jszip/jszip.min.js",
      });
    } catch (e) {
      console.error(e);
      NodeUpdate.updateElement(
        "preview",
        `<img src="img/saber_empty.webp" alt="no preview" title="no preview" />`,
      );
    }
  }

  public async getImage(type: "preview" | "animation" | "renderedImage") {
    try {
      NodeUpdate.updateElement(
        "preview",
        `<img class="previewImage loadingImage" src="img/loading.webp" alt="loading" title="loading" />`,
      );
      const data = this.getFormData();
      const res = await fetch(`/api/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const uri = await res.json();
      NodeUpdate.updateElement(
        "preview",
        `
    <div class="btn3d">
        <button onclick="gui.display3DModel()">
            <img src="img/3D.svg" alt="display in 3D" title="display in 3D"/>
        </button>
    </div>
    <img class="previewImage" src="${uri}" alt="${type}" title="${type}" />`,
      );
    } catch (e) {
      console.error(e);
      NodeUpdate.updateElement(
        "preview",
        `<img class="previewImage" src="img/saber_empty.webp" alt="no preview" title="no preview" />`,
      );
    }
  }

  private async init() {
    const formParam: ParameterDefinition = (await (
      await fetch("/api/parameter")
    ).json()) as ParameterDefinition;
    const customiserForm = new CustomiserForm();
    NodeUpdate.updateElement("main", await customiserForm.initForm(formParam));
    this.changePart(
      document.getElementById("emitterType") as HTMLSelectElement,
    );
    this.changePart(document.getElementById("handleType") as HTMLSelectElement);
    this.changePart(document.getElementById("pommelType") as HTMLSelectElement);
    this.formChanged();
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
