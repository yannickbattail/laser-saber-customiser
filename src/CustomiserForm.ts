import {
  ParameterBase,
  ParameterBoolean,
  ParameterDefinition,
  ParameterNumber,
  ParameterNumberOption,
  ParameterString,
  ParameterStringOption,
} from "../commons/openscad/ParameterDefinition.js";
import { clone, groupBy } from "./utils.js";
import { ParameterKV } from "laser-saber-customiser-commons/openscad/ParameterSet.js";

export class CustomiserForm {
  private defaultGroup = "Parameters";

  public constructor(
    private id: string,
    private param: ParameterDefinition,
  ) {}

  public async initForm(
    formValue: Record<string, string> | null,
  ): Promise<string> {
    const formParam = clone(this.param);
    if (formValue) {
      this.setValues(formParam, formValue);
    }
    const groupedFormParam = groupBy(
      formParam.parameters,
      (p) => p.group ?? "Global",
    );
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

  private setValues(
    param: ParameterDefinition,
    formValue: Record<string, string>,
  ) {
    param.parameters.forEach(
      (p) => (p.initial = p.name in formValue ? formValue[p.name] : p.initial),
    );
  }

  private displayGroup(
    groupedFormParamKey: string,
    groupedFormParam: Record<
      string,
      (ParameterNumber | ParameterString | ParameterBoolean)[]
    >,
  ) {
    let html = "<br>";
    html += `
<div id="group_${groupedFormParamKey}" class="toggleBlock">
  <div id="toggleTitle_${groupedFormParamKey}"  class="toggleShow" onclick="toggle(event)">${groupedFormParamKey}</div>
  <div>
    <table>
      ${groupedFormParam[groupedFormParamKey].map((p) => this.generateFormParam(p, groupedFormParamKey === this.defaultGroup)).join("\n")}
    </table>
  </div>
</div>
`;
    return html;
  }

  private generateFormParam(
    p:
      | ParameterNumber
      | ParameterString
      | ParameterBoolean
      | ParameterStringOption
      | ParameterNumberOption,
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

  private generateLine(p: ParameterBase, inside: string) {
    return `
<tr>
  <td><label for="${p.name}">${p.caption ? p.caption : p.name}</label></td>
  <td>${inside}</td>
</tr>`;
  }

  private generateNumber(p: ParameterNumber) {
    return this.generateLine(
      p,
      `<input type="number" id="${p.name}" name="${p.name}" value="${p.initial}" min="${p.min}" max="${p.max}" step="${p.step}" />`,
    );
  }

  private generateString(p: ParameterString) {
    return this.generateLine(
      p,
      `<input type="text" id="${p.name}" name="${p.name}" value="${p.initial}" maxlength="${p.maxLength}" />`,
    );
  }

  private generateSelect(
    p: ParameterStringOption | ParameterNumberOption,
    mainGroup?: boolean,
  ) {
    const onChange = mainGroup ? `onchange="gui.changePart(this)"` : "";
    return this.generateLine(
      p,
      `
<select id="${p.name}" name="${p.name}" ${onChange}>
    ${p.options?.map((o) => `<option value="${o.value}" ${o.value === p.initial ? 'selected="selected"' : ""}>${o.name}</option>`).join("\n")}
</select>`,
    );
  }

  private generateBoolean(p: ParameterBoolean) {
    return this.generateLine(
      p,
      `<input type="radio" id="${p.name}" name="${p.name}" ${p.initial ? 'checked="checked"' : ""} value="true"/>✅
       <input type="radio" id="${p.name}" name="${p.name}" ${p.initial ? "" : 'checked="checked"'} value="false"/>❌`,
    );
  }

  public getFormData(): ParameterKV[] {
    const form = document.getElementById(this.id) as HTMLFormElement;
    const formData = new FormData(form);
    const data: ParameterKV[] = [];
    formData.forEach((value, key) => {
      data.push({ parameter: key, value: value as string });
    });
    return data;
  }
}
