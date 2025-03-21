import {
  ParameterBase,
  ParameterBoolean,
  ParameterDefinition,
  ParameterNumber,
  ParameterString,
} from "../commons/types/openscadParameterDefinition.js";

export class CustomiserForm {
  public constructor() {}
  private defaultGroup = "Parameters";
  public async initForm(formParam: ParameterDefinition): Promise<string> {
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
  <form id="form" onchange="gui.formChanged()">
    ${html}
  </form>
</div>`;
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
    p: ParameterNumber | ParameterString | ParameterBoolean,
    mainGroup: boolean,
  ) {
    if ((p.type === "number" || p.type === "string") && p.options) {
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
    p: ParameterString | ParameterNumber,
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
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce(
    (groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    },
    {} as Record<K, T[]>,
  );
