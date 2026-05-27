import { describe, it, expect, beforeEach } from "vitest";
import { CustomiserForm } from "../CustomiserForm";
import { ParameterDefinition, ParameterStringOption } from "openscad-cli-wrapper/dist/src/openscad/ParameterDefinition";

describe("CustomiserForm", () => {
  let customiserForm: CustomiserForm;

  beforeEach(() => {
    customiserForm = new CustomiserForm();
  });

  it("should generate a form with basic structure", async () => {
    const param: ParameterDefinition = {
      title: "Test Form",
      parameters: [],
    };
    const html = await customiserForm.initForm(param, null);
    expect(html).toContain('<form id="form" onchange="gui.formChanged()">');
    expect(html).toContain("</form>");
  });

  it("should generate a number input", async () => {
    const param: ParameterDefinition = {
      title: "Test Form",
      parameters: [
        {
          name: "testNumber",
          caption: "Test Number",
          type: "number",
          initial: 10,
          min: 0,
          max: 100,
          step: 1,
        },
      ],
    };
    const html = await customiserForm.initForm(param, null);
    expect(html).toContain('<label for="testNumber">Test Number</label>');
    expect(html).toContain(
      '<input type="number" id="testNumber" name="testNumber" value="10" min="0" max="100" step="1" />',
    );
  });

  it("should generate a string input", async () => {
    const param: ParameterDefinition = {
      title: "Test Form",
      parameters: [
        {
          name: "testString",
          caption: "Test String",
          type: "string",
          initial: "hello",
          maxLength: 20,
        },
      ],
    };
    const html = await customiserForm.initForm(param, null);
    expect(html).toContain('<label for="testString">Test String</label>');
    expect(html).toContain('<input type="text" id="testString" name="testString" value="hello" maxlength="20" />');
  });

  it("should generate boolean radio buttons", async () => {
    const param: ParameterDefinition = {
      title: "Test Form",
      parameters: [
        {
          name: "testBoolean",
          type: "boolean",
          initial: true,
        },
      ],
    };
    const html = await customiserForm.initForm(param, null);
    expect(html).toContain('type="radio" id="testBoolean" name="testBoolean" checked="checked" value="true"');
    expect(html).toContain('type="radio" id="testBoolean" name="testBoolean"  value="false"');
  });

  it("should generate boolean radio buttons (false)", async () => {
    const param: ParameterDefinition = {
      title: "Test Form",
      parameters: [
        {
          name: "testBoolean",
          type: "boolean",
          initial: false,
        },
      ],
    };
    const html = await customiserForm.initForm(param, null);
    expect(html).toContain('type="radio" id="testBoolean" name="testBoolean"  value="true"');
    expect(html).toContain('type="radio" id="testBoolean" name="testBoolean" checked="checked" value="false"');
  });

  it("should generate a select for options", async () => {
    const param: ParameterDefinition = {
      title: "Test Form",
      parameters: [
        {
          name: "testSelect",
          type: "string",
          initial: "opt2",
          options: [
            { name: "Option 1", value: "opt1" },
            { name: "Option 2", value: "opt2" },
          ],
        } as ParameterStringOption,
      ],
    };
    const html = await customiserForm.initForm(param, null);
    expect(html).toContain('<select id="testSelect" name="testSelect" >');
    expect(html).toContain('<option value="opt1" >Option 1</option>');
    expect(html).toContain('<option value="opt2" selected="selected">Option 2</option>');
  });

  it("should add onchange for select in Parameters group", async () => {
    const param: ParameterDefinition = {
      title: "Test Form",
      parameters: [
        {
          name: "testSelect",
          type: "string",
          initial: "opt1",
          group: "Parameters",
          options: [{ name: "Option 1", value: "opt1" }],
        } as ParameterStringOption,
      ],
    };
    const html = await customiserForm.initForm(param, null);
    expect(html).toContain('onchange="gui.changePart(this)"');
  });

  it("should group parameters", async () => {
    const param: ParameterDefinition = {
      title: "Test Form",
      parameters: [
        { name: "p1", type: "string", initial: "v1", group: "Group A" },
        { name: "p2", type: "string", initial: "v2", group: "Group B" },
      ],
    };
    const html = await customiserForm.initForm(param, null);
    expect(html).toContain('<div id="group_Group A"');
    expect(html).toContain('<div id="group_Group B"');
    expect(html).toContain("Group A</div>");
    expect(html).toContain("Group B</div>");
  });

  it("should exclude debug groups", async () => {
    const param: ParameterDefinition = {
      title: "Test Form",
      parameters: [
        { name: "p1", type: "string", initial: "v1", group: "debug_info" },
        { name: "p2", type: "string", initial: "v2", group: "Normal" },
      ],
    };
    const html = await customiserForm.initForm(param, null);
    expect(html).not.toContain("group_debug_info");
    expect(html).toContain("group_Normal");
  });

  it("should set initial values from formValue", async () => {
    const param: ParameterDefinition = {
      title: "Test Form",
      parameters: [{ name: "p1", type: "string", initial: "default" }],
    };
    const formValue = { p1: "custom" };
    const html = await customiserForm.initForm(param, formValue);
    expect(html).toContain('value="custom"');
  });

  it("should handle partial formValue in setValues", async () => {
    const param: ParameterDefinition = {
      title: "Test Form",
      parameters: [
        { name: "p1", type: "string", initial: "default1" },
        { name: "p2", type: "string", initial: "default2" },
      ],
    };
    const formValue = { p1: "custom1" };
    const html = await customiserForm.initForm(param, formValue);
    expect(html).toContain('name="p1" value="custom1"');
    expect(html).toContain('name="p2" value="default2"');
  });

  it("should use name as caption if caption is missing", async () => {
    const param: ParameterDefinition = {
      title: "Test Form",
      parameters: [
        {
          name: "testNoCaption",
          type: "string",
          initial: "",
        },
      ],
    };
    const html = await customiserForm.initForm(param, null);
    expect(html).toContain('<label for="testNoCaption">testNoCaption</label>');
  });

  it("should use Global as default group name", async () => {
    const param: ParameterDefinition = {
      title: "Test Form",
      parameters: [
        {
          name: "testGlobal",
          type: "string",
          initial: "",
        },
      ],
    };
    const html = await customiserForm.initForm(param, null);
    expect(html).toContain('<div id="group_Global"');
  });
});
