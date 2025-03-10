import { NodeUpdate } from "./NodeUpdate.js";
import {
  ParameterBase,
  ParameterBoolean,
  ParameterDefinition,
  ParameterNumber,
  ParameterString,
} from "../commons/types/openscadParameterDefinition.js";

export class Gui {
  constructor() {
    this.init().then(() => {
      window.setInterval(() => {
        this.atInterval();
      }, 100);
    });
  }

  private async init() {
    NodeUpdate.updateElement("main", await this.initForm());
  }

  private async initForm(): Promise<string> {
    const formParam: ParameterDefinition = (await (
      await fetch("/api/parameter")
    ).json()) as ParameterDefinition;
    const groupedFormParam = groupBy(
      formParam.parameters,
      (p) => p.group ?? "",
    );
    let html = "";
    for (const groupedFormParamKey in groupedFormParam) {
      if (groupedFormParamKey.includes("debug")) continue;
      html += "<br>";
      html += `
<fieldset>
  <legend>${groupedFormParamKey}</legend>
  <table>
  ${groupedFormParam[groupedFormParamKey].map((p) => this.generateFormParam(p)).join("\n")}
  </table>
</fieldset>
`;
    }
    return `
<div>
  <form>
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

  private generateNumber(p: ParameterNumber) {
    if (p.options) {
      return this.generateSelect(p);
    }
    return this.generateLine(
      p,
      `<input type="number" id="${p.name}" name="${p.name}" value="${p.initial}" min="${p.min}" max="${p.max}" step="${p.step}" >`,
    );
  }

  private generateString(p: ParameterString) {
    if (p.options) {
      return this.generateSelect(p);
    }
    return this.generateLine(
      p,
      `<input type="text" id="${p.name}" name="${p.name}" value="${p.initial}" maxlength="${p.maxLength}">`,
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
      `<input type="checkbox" id="${p.name}" name="${p.name}" ${p.initial ? 'checked="checked"' : ""}>`,
    );
  }

  private generateLine(p: ParameterBase, inside: string) {
    return `
<tr>
  <td><label for="${p.name}">${p.caption ? `${p.caption} (<i>${p.name}</i>)` : p.name}</label></td>
  <td>${inside}</td>
</tr>`;
  }

  private atInterval() {
    this.refresh();
  }

  private refresh() {}
}

const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce(
    (groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    },
    {} as Record<K, T[]>,
  );
