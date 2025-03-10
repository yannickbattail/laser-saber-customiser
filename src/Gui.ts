import { NodeUpdate } from "./NodeUpdate.js";
import {
  ParameterBase,
  ParameterBoolean,
  ParameterList,
  ParameterNumber,
  ParameterString,
} from "./types";

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
    const formParam: ParameterList = (await (
      await fetch("/api/parameter")
    ).json()) as ParameterList;
    return `
<div>
<form>
<table>
${formParam.parameters.map((p) => this.generateFormParam(p)).join("\n")}
</table>
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
  <td><label for="${p.name}">${p.name}</label></td>
  <td>${inside}</td>
</tr>`;
  }

  private atInterval() {
    this.refresh();
  }

  private refresh() {}
}
