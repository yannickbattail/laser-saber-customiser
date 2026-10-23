import { CustomiserForm } from "./CustomiserForm.js";
import { IPresetRepository } from "./IPresetRepository.js";
import { _throw, tryCatch } from "./utils.js";
import { IBackendApi } from "./serverApi/IBackendApi.js";
import { preview3D } from "./3dPreview.js";

export class Gui {
  readonly PRESET_PARM_NAME: string = "p";
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

  public async display3DModel() {
    try {
      const data = this.customiserForm.getFormData();
      const endpoint = "/api/openscad/model.3mf";
      const uri = `${endpoint}?${this.PRESET_PARM_NAME}=${encodeURIComponent(JSON.stringify(data))}`;
      preview3D(uri);
    } catch (e) {
      console.error(e);
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
      await this.display3DModel();
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
