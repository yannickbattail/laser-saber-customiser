import { NodeUpdate } from "./NodeUpdate.js";
import { CustomiserForm } from "./CustomiserForm.js";
import {
  OpenScadOutputWithParameterDefinition,
  OpenScadOutputWithSummary,
} from "../commons/openscad/OpenScadOutput.js";
import { ParameterKV } from "laser-saber-customiser-commons/openscad/ParameterSet.js";
import { IPresetRepository } from "./IPresetRepository.js";
import { _throw } from "./utils.js";

export class Gui {
  private lastFormChanged = 0;
  private changeTimeout = 2000;

  constructor(private presetRepository: IPresetRepository) {
    this.presetRepository = presetRepository;
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

  public async savePreset() {
    const parameterSetName = window.prompt("Enter preset name");
    if (parameterSetName) {
      this.presetRepository.savePreset(parameterSetName, this.getFormData());
      this.initPresets();
    }
  }

  public async delPreset() {
    const presetSelect =
      (document.getElementById("presetSelect") as HTMLSelectElement) ||
      _throw(new Error("'presetSelect' ID not found"));
    this.presetRepository.delPresets(presetSelect.value);
    this.initPresets();
    await this.changePreset();
  }

  public async changePreset() {
    await this.initForm();
    this.formChanged();
  }

  public async preview() {
    await this.getImage("preview");
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
      const res = await fetch(`/api/openscad/3DModel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const divPreview = document.getElementById("preview");
      if (divPreview) divPreview.innerHTML = "";
      const out = (await res.json()) as OpenScadOutputWithSummary;
      const uri = "../../" + out.file.replace("./src/", "/");
      NodeUpdate.updateElement(
        "preview",
        `
   <div class="btn3d">
        <a href="${uri}">
            <img src="img/download.svg" alt="Download" title="Download"/>
        </a>
    </div>
    <div id="stlViewer" class="stlViewer"></div>`,
      );
      // @ts-expect-error in js
      new StlViewer(document.getElementById("stlViewer"), {
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

  public async getImage(type: "preview" | "animation") {
    try {
      NodeUpdate.updateElement(
        "preview",
        `<img class="previewImage loadingImage" src="img/loading.webp" alt="loading" title="loading" />`,
      );
      const data = this.getFormData();
      const res = await fetch(`/api/openscad/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const uri = (await res.json()) as OpenScadOutputWithSummary;
      NodeUpdate.updateElement(
        "preview",
        `
    <div class="btn3d">
        <button onclick="gui.display3DModel()">
            <img src="img/3D.svg" alt="display in 3D" title="display in 3D"/>
        </button>
    </div>
    <img src="${uri.file.replace("./src/", "/")}" alt="${type}" title="${type}" />`,
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
    await this.initForm();
    this.formChanged();
    this.initPresets();
  }

  private async initForm() {
    const formParam: OpenScadOutputWithParameterDefinition = (await (
      await fetch("/api/openscad/parameter")
    ).json()) as OpenScadOutputWithParameterDefinition;
    const customiserForm = new CustomiserForm();
    const selectedPreset = this.getSelectedPreset();
    NodeUpdate.updateElement(
      "main",
      await customiserForm.initForm(
        formParam.parameterDefinition,
        selectedPreset,
      ),
    );
    this.changePart(
      document.getElementById("emitterType") as HTMLSelectElement,
    );
    this.changePart(document.getElementById("handleType") as HTMLSelectElement);
    this.changePart(document.getElementById("pommelType") as HTMLSelectElement);
  }

  private initPresets() {
    const presets = this.presetRepository.getPresets();
    const presetSelect =
      (document.getElementById("presetSelect") as HTMLSelectElement) ||
      _throw(new Error("'presetSelect' ID not found"));
    const presetNames = Object.keys(presets.parameterSets);
    presetSelect.innerHTML = "";
    presetNames.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      presetSelect.appendChild(option);
    });
  }

  private getSelectedPreset(): Record<string, string> | null {
    const presetSelect =
      (document.getElementById("presetSelect") as HTMLSelectElement) ||
      _throw(new Error("'presetSelect' ID not found"));
    const presets = this.presetRepository.getPresets();
    const presetName = presetSelect.value;
    if (presetName && presetName in presets.parameterSets) {
      return presets.parameterSets[presetName];
    }
    return null;
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

  private getFormData(): ParameterKV[] {
    const form = document.getElementById("form") as HTMLFormElement;
    const formData = new FormData(form);
    const data: ParameterKV[] = [];
    formData.forEach((value, key) => {
      data.push({ parameter: key, value: value as string });
    });
    return data;
  }
}
