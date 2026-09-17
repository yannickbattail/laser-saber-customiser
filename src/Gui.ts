import { OpenScadOutputWithParameterDefinition } from "openscad-cli-wrapper/dist/src/types/OpenScadSummary.js";
import { NodeUpdate } from "./NodeUpdate.js";
import { CustomiserForm } from "./CustomiserForm.js";
import { IPresetRepository } from "./IPresetRepository.js";
import { _throw } from "./utils.js";
import { IBackendApi } from "./serverApi/IBackendApi.js";

export class Gui {
  private lastFormChanged = 0;
  private changeTimeout = 2000;
  private customiserForm: CustomiserForm;

  constructor(
    private presetRepository: IPresetRepository,
    private backend: IBackendApi,
  ) {
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
    document.querySelectorAll(`[id^="toggleTitle_${me.id} : "]`).forEach((e) => {
      e.classList.add("toggleHide");
      e.classList.remove("toggleShow");
    });
    document.getElementById(`toggleTitle_${group}`)?.classList?.add("toggleShow");
    document.getElementById(`toggleTitle_${group}`)?.classList?.remove("toggleHide");
  }

  public async savePreset() {
    const parameterSetName = window.prompt("Enter preset name");
    if (parameterSetName) {
      if (parameterSetName !== "" && parameterSetName !== "<Default>") {
        await this.presetRepository.savePreset(parameterSetName, this.customiserForm.getFormData());
        await this.initPresets(parameterSetName);
      }
    }
  }

  public async export() {
    const preset = this.customiserForm.getFormData();
    prompt("Copy it and save it", JSON.stringify(preset));
  }

  public async import() {
    const presetStr = prompt("Paste your saved preset here", "{}");
    const preset = this.parseGivenPreset(presetStr);
    if (preset) {
      console.log(preset);
      await this.initForm(preset);
      this.formChanged();
    } else {
      console.log("Nothing to import");
    }
  }

  private parseGivenPreset(presetStr: string | null): Record<string, string> {
    if (!presetStr) return {} as Record<string, string>;
    try {
      return JSON.parse(presetStr) as Record<string, string>;
    } catch (e) {
      alert(`Cannot use what you pasted here.

Error${e}`);

      console.warn(e);
      return {} as Record<string, string>;
    }
  }

  public async delPreset() {
    await this.presetRepository.deletePreset(this.getSelectedPreset());
    await this.initPresets(null);
    await this.changePreset();
  }

  public async changePreset() {
    await this.initForm(await this.presetRepository.getPresetByName(this.getSelectedPreset()));
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
      const data = this.customiserForm.toKV(this.customiserForm.getFormData());
      const out = await this.backend.generateModel(data);
      const divPreview = document.getElementById("preview");
      if (divPreview) divPreview.innerHTML = "";
      const uri = `../../${out.file.replace("./src/", "/")}?t=${new Date().getTime()}`;
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
      NodeUpdate.updateElement("preview", `<img src="img/saber_empty.webp" alt="no preview" title="no preview" />`);
    }
  }

  public async getImage(type: "preview" | "animation") {
    try {
      NodeUpdate.updateElement(
        "preview",
        `<img class="previewImage loadingImage" src="img/loading.webp" alt="loading" title="loading" />`,
      );
      const data = this.customiserForm.toKV(this.customiserForm.getFormData());
      const outputSummary = await (type === "preview"
        ? this.backend.generatePreview(data)
        : this.backend.generateAnimation(data));
      NodeUpdate.updateElement(
        "preview",
        `
    <div class="btn3d">
        <button onclick="gui.display3DModel()">
            <img src="img/3D.svg" alt="display in 3D" title="display in 3D"/>
        </button>
    </div>
    <img src="${outputSummary.file.replace("./src/", "/")}?t=${new Date().getTime()}" alt="${type}" title="${type}" />`,
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
    const formParam: OpenScadOutputWithParameterDefinition = await this.backend.getParameterDefinition();
    this.customiserForm = new CustomiserForm("lsc__form_", formParam.parameterDefinition);
    await this.initForm(await this.presetRepository.getPresetByName(this.getSelectedPreset()));
    this.formChanged();
    await this.initPresets(null);
  }

  private async initForm(selectedPreset: Record<string, string> | null) {
    NodeUpdate.updateElement("main", await this.customiserForm.initForm(selectedPreset));
    this.changePart(document.getElementById("emitterType") as HTMLSelectElement);
    this.changePart(document.getElementById("handleType") as HTMLSelectElement);
    this.changePart(document.getElementById("pommelType") as HTMLSelectElement);
  }

  private async initPresets(selectedPreset: string | null) {
    const selPreset = selectedPreset ?? "<Default>";
    const presets = await this.presetRepository.getPresets();
    presets.add("<Default>", []);
    const presetSelect =
      (document.getElementById("presetSelect") as HTMLSelectElement) ||
      _throw(new Error("'presetSelect' ID not found"));
    const presetNames = Object.keys(presets.parameterSets);
    presetSelect.innerHTML = "";

    presetNames.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      if (selPreset === name) {
        option.selected = true;
      }
      presetSelect.appendChild(option);
    });
  }

  private getSelectedPreset(): string {
    return (
      (document.getElementById("presetSelect") as HTMLSelectElement).value ||
      _throw(new Error("'presetSelect' ID not found"))
    );
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
}
