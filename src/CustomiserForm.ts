import { clone, groupBy, label } from "./utils.js";
import {
  ParameterBoolean,
  ParameterDefinition,
  ParameterNumber,
  ParameterNumberOption,
  ParameterString,
  ParameterStringOption,
} from "openscad-cli-wrapper/dist/src/types/ParameterDefinition.js";
import { ParameterKV } from "openscad-cli-wrapper/dist/src/types/ParameterSet.js";

export class CustomiserForm {
  private defaultGroup = "Parameters";

  public constructor(
    private id: string,
    private param: ParameterDefinition,
  ) {}

  public async initForm(formValue: Record<string, string> | null): Promise<string> {
    const formParam = clone(this.param);
    this.setValues(formParam, formValue ?? {});
    const groupedFormParam = groupBy(formParam.parameters, (p) => p.group ?? "Global");
    let html = "";
    for (const groupedFormParamKey in groupedFormParam) {
      if (!groupedFormParamKey.includes("debug")) {
        html += this.displayGroup(groupedFormParamKey, groupedFormParam);
      }
    }
    return `
<div>
  <form id="${this.id}" onchange="gui.formChanged()">
    ${html}
  </form>
</div>`;
  }

  public getFormData(): Record<string, string> {
    const form = document.getElementById(this.id) as HTMLFormElement;
    const formData = new FormData(form);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });
    return data;
  }
  public toKV(formData: Record<string, string>): ParameterKV[] {
    const data: ParameterKV[] = [];
    Object.entries(formData).forEach((e) => {
      data.push({ parameter: e[0], value: e[1] as string });
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
    const onChange = mainGroup ? `onchange="gui.changePart(this)"` : "";
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
}
