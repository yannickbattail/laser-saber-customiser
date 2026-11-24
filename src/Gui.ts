import { NodeUpdate } from "./NodeUpdate.js";
import { CustomiserForm } from "./CustomiserForm.js";
import { IPresetRepository } from "./IPresetRepository.js";
import { _throw, tryCatch } from "./utils.js";
import { IBackendApi } from "./serverApi/IBackendApi.js";
import { activateAccelerometer, preview3D, Preview3DViewer, replace3DModel } from "./3dPreview.js";

export class Gui {
  readonly PRESET_PARM_NAME: string = "p";
  readonly changeTimeout = 100;
  private lastFormChanged = 0;
  private customiserForm: CustomiserForm;
  viewer: Preview3DViewer;
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
    this.startAnimation();
    window.setTimeout(() => this.applyChanges(), this.changeTimeout + 50);
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
    prompt("Copy it", window.location.href);
  }

  public async delPreset() {
    await this.presetRepository.deletePreset(this.getSelectedPreset());
    await this.initPresets(null);
    await this.changePreset();
  }

  public async changePreset() {
    this.initForm(await this.presetRepository.getPresetByName(this.getSelectedPreset()));
    this.formChanged();
  }

  public toggleAccelerometer() {
    const accelerometer = document.getElementById("accelerometer") as HTMLInputElement;
    activateAccelerometer(accelerometer.checked);
  }

  public async preview() {
    await this.getImage("preview");
  }

  public async animation() {
    await this.getImage("animation");
  }

  public async display3DModel() {
    try {
      this.setStatus("GENERATING");
      this.show("3DViewer");
      NodeUpdate.updateElement("preview", ``);
      const data = this.customiserForm.getFormData();
      const endpoint = "/api/openscad/model.3mf";
      const uri = `${endpoint}?${this.PRESET_PARM_NAME}=${encodeURIComponent(JSON.stringify(data))}`;
      replace3DModel(this.viewer, uri, () => this.ready());
    } catch (e) {
      console.error(e);
      NodeUpdate.updateElement("preview", ``);
    }
  }

  public async getImage(type: "preview" | "animation") {
    try {
      const data = this.customiserForm.getFormData();
      const endpoint = type === "preview" ? "/api/openscad/image.png" : "/api/openscad/animation.webp";
      const url = `${endpoint}?${this.PRESET_PARM_NAME}=${encodeURIComponent(JSON.stringify(data))}`;
      const newImg = new Image();
      newImg.onload = () => {
        this.hideAnimation();
        NodeUpdate.updateElement(
          "preview",
          `
    <div class="btn3d">
        <button onclick="gui.display3DModel()">
            <img src="img/3D.svg" alt="display in 3D" title="display in 3D"/>
        </button>
    </div>
    <img src="${url}" alt="${type}" title="${type}" />`,
        );
      };
      newImg.src = url;
    } catch (e) {
      console.error(e);
      NodeUpdate.updateElement("preview", ``);
    }
  }

  public ready() {
    this.setStatus("READY");
  }

  private setStatus(status: string) {
    const s = document.getElementById("status");
    if (s) {
      s.innerText = `STATUS: ${status}`;
      s.className = status.toLowerCase();
    }
  }

  private show(status: "preview" | "3DViewer") {
    const p = document.getElementById("preview");
    if (p) {
      p.style.display = status == "preview" ? "flex" : "none";
    }
    const v = document.getElementById("3DViewer");
    if (v) {
      v.style.display = status == "3DViewer" ? "flex" : "none";
    }
  }

  private async init() {
    await this.setVersion();
    const formParam = await this.backend.getParameterDefinition();
    this.customiserForm = new CustomiserForm("main", formParam);
    const preset = await this.presetRepository.getPresetByName(this.getSelectedPreset());
    const p = tryCatch(
      () => JSON.parse(new URL(location.href).searchParams.get(this.PRESET_PARM_NAME) ?? "null"),
      `error parsing URL param ?${this.PRESET_PARM_NAME}=...`,
    );
    this.initForm(p ?? preset);
    this.formChanged();
    await this.initPresets(null);
    this.viewer = preview3D("3DViewer");
  }

  private initForm(selectedPreset: Record<string, string> | null) {
    this.customiserForm.buildForm(selectedPreset);
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

  private async setVersion() {
    const version = (await (await fetch("/package.json")).json()) as {
      version: string;
    };
    (document.getElementById("version") as HTMLSelectElement).innerText = version.version;
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
      this.updateUrl();
      this.show("preview");
      await this.preview();
    }
  }

  private startAnimation() {
    const anim = document.getElementById("status-animation");
    if (anim) {
      anim.classList.remove("active");
      void anim.offsetWidth;
      anim.classList.add("active");
    }
  }

  private hideAnimation() {
    const anim = document.getElementById("status-animation");
    if (anim) {
      anim.classList.remove("active");
    }
  }

  private updateUrl() {
    const preset = JSON.stringify(this.customiserForm.getFormData());
    const newUrl = new URL(window.location.href);
    newUrl.search = `?${this.PRESET_PARM_NAME}=${preset}`;
    const imageUrl = new URL(window.location.href);
    imageUrl.pathname = `/api/openscad/image.png`;
    imageUrl.search = `?${this.PRESET_PARM_NAME}=${preset}`;
    window.history.pushState(preset, "", newUrl.href);
    this.updateMetas(newUrl.href, imageUrl.href);
  }

  private updateMetas(pageUri: string, imageUri: string) {
    this.updateMetaProperty("og:url", pageUri);
    this.updateMetaProperty("og:image", imageUri);
    this.updateMetaName("twitter:image", imageUri);
  }

  private updateMetaProperty(property: string, content: string) {
    (document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement).content = content;
  }
  private updateMetaName(name: string, content: string) {
    (document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement).content = content;
  }
}
