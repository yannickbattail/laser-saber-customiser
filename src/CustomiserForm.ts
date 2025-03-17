import {
  ParameterBase,
  ParameterBoolean,
  ParameterDefinition,
  ParameterNumber,
  ParameterString,
} from "../commons/types/openscadParameterDefinition.js";

export class CustomiserForm {
  public constructor() {}
  public async initForm(formParam: ParameterDefinition): Promise<string> {
    const groupedFormParam = groupBy(
      formParam.parameters,
      (p) => p.group ?? "Global",
    );
    let html = "";
    for (const groupedFormParamKey in groupedFormParam) {
      if (groupedFormParamKey.includes("debug")) continue;
      html += "<br>";
      html += `
<div class="toggleBlock">
  <div class="toggleShow" onclick="toggle(event)">${groupedFormParamKey}</div>
  <div>
    <table>
      ${groupedFormParam[groupedFormParamKey].map((p) => this.generateFormParam(p)).join("\n")}
    </table>
  </div>
</div>
`;
    }
    return `
<div>
  <form id="form" onchange="gui.formChanged()">
    ${html}
  </form>
</div>`;
  }

  private generateFormParam(
    p: ParameterNumber | ParameterString | ParameterBoolean,
  ) {
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
    if (p.options) {
      return this.generateSelect(p);
    }
    return this.generateLine(
      p,
      `<input type="number" id="${p.name}" name="${p.name}" value="${p.initial}" min="${p.min}" max="${p.max}" step="${p.step}" />`,
    );
  }

  private generateString(p: ParameterString) {
    if (p.options) {
      return this.generateSelect(p);
    }
    return this.generateLine(
      p,
      `<input type="text" id="${p.name}" name="${p.name}" value="${p.initial}" maxlength="${p.maxLength}" />`,
    );
  }

  private generateSelect(p: ParameterString | ParameterNumber) {
    return this.generateLine(
      p,
      `
<select id="${p.name}" name="${p.name}">
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
