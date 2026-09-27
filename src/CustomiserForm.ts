import { clone, groupBy, label } from "./utils.js";
import {
  ParameterBoolean,
  ParameterDefinition,
  ParameterNumber,
  ParameterNumberOption,
  ParameterString,
  ParameterStringOption,
} from "openscad-cli-wrapper/dist/src/types/ParameterDefinition.js";

export class CustomiserForm {
  private defaultGroup = "Parameters";
  private readonly formId = "lsc__form_";

  public constructor(
    private parentId: string,
    private param: ParameterDefinition,
  ) {}

  public buildForm(formValue: Record<string, string> | null) {
    const formParam = clone(this.param);
    this.setValues(formParam, formValue ?? {});
    const groupedFormParam = groupBy(formParam.parameters, (p) => p.group ?? "Global");
    let html = "";
    for (const groupedFormParamKey in groupedFormParam) {
      if (!groupedFormParamKey.includes("debug")) {
        html += this.displayGroup(groupedFormParamKey, groupedFormParam);
      }
    }
    const parent = document.getElementById(this.parentId) as HTMLElement;
    const formHtml = `
      <div>
        <form id="${this.formId}" onchange="gui.formChanged()">
          ${html}
        </form>
      </div>`;
    parent.innerHTML = formHtml;
    CustomiserForm.changePart(document.getElementById("emitterType") as HTMLSelectElement);
    CustomiserForm.changePart(document.getElementById("handleType") as HTMLSelectElement);
    CustomiserForm.changePart(document.getElementById("pommelType") as HTMLSelectElement);
    return formHtml;
  }

  public getFormData(): Record<string, string> {
    const form = document.getElementById(this.formId) as HTMLFormElement;
    const formData = new FormData(form);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });
    return data;
  }

  private setValues(param: ParameterDefinition, formValue: Record<string, string>) {
    param.parameters.forEach((p) => (p.initial = p.name in formValue ? formValue[p.name] : p.initial));
  }

  private displayGroup(
    groupedFormParamKey: string,
    groupedFormParam: Record<string, (ParameterNumber | ParameterString | ParameterBoolean)[]>,
  ) {
    return `
<div id="group_${groupedFormParamKey}" class="toggleBlock parameterGroup">
  <div id="toggleTitle_${groupedFormParamKey}"  class="toggleShow" onclick="toggle(event)">${label(groupedFormParamKey)}</div>
  <div>
    <table>
      ${groupedFormParam[groupedFormParamKey].map((p) => this.generateFormParam(p, groupedFormParamKey === this.defaultGroup)).join("\n")}
    </table>
  </div>
</div>
`;
  }

  private generateFormParam(
    p: ParameterNumber | ParameterString | ParameterBoolean | ParameterStringOption | ParameterNumberOption,
    mainGroup: boolean,
  ) {
    return `
<tr>
  <td><label for="${p.name}">${label(p.caption ? p.caption : p.name)}</label></td>
  <td>${this.generateFormParamLine(p, mainGroup)}</td>
</tr>`;
  }

  private generateFormParamLine(
    p: ParameterNumber | ParameterString | ParameterBoolean | ParameterStringOption | ParameterNumberOption,
    mainGroup: boolean,
  ) {
    if ("options" in p) {
      return this.generateSelect(p, mainGroup);
    }
    switch (p.type) {
      case "number":
        return this.generateNumber(p);
      case "string":
        return this.generateString(p);
      case "boolean":
        return this.generateBoolean(p);
    }
  }

  private generateNumber(p: ParameterNumber) {
    return `<input type="number" id="${p.name}" name="${p.name}" value="${p.initial}" min="${p.min}" max="${p.max}" step="${p.step}" />`;
  }

  private generateString(p: ParameterString) {
    return `<input type="text" id="${p.name}" name="${p.name}" value="${p.initial}" maxlength="${p.maxLength}" />`;
  }

  private generateSelect(p: ParameterStringOption | ParameterNumberOption, mainGroup?: boolean) {
    const onChange = mainGroup ? `onchange="CustomiserForm.changePart(this)"` : "";
    return `
<select id="${p.name}" name="${p.name}" ${onChange} autocomplete="off">
    ${p.options?.map((o) => `<option value="${o.value}" ${o.value === p.initial ? 'selected="selected"' : ""}>${label(o.name)}</option>`).join("\n")}
</select>`;
  }

  private generateBoolean(p: ParameterBoolean) {
    return `
    <input type="radio" id="${p.name}" name="${p.name}" ${p.initial ? 'checked="checked"' : ""} value="true"/>✅
    <input type="radio" id="${p.name}" name="${p.name}" ${p.initial ? "" : 'checked="checked"'} value="false"/>❌`;
  }

  public static changePart(me: HTMLSelectElement | null) {
    if (!me) return;
    const group = `${me.id} : ${me.value}`;
    document.querySelectorAll(`[id^="group_${me.id} : "]`).forEach((e) => {
      e.classList.add("hide");
      e.classList.remove("show");
    });
    document.getElementById(`group_${group}`)?.classList?.add("show");
    document.getElementById(`group_${group}`)?.classList?.remove("hide");
  }
}
