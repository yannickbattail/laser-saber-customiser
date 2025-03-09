import Ajv, { JSONSchemaType } from "ajv";

const schema: JSONSchemaType<ParameterKV[]> = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "ParameterKVArray",
  type: "array",
  items: {
    type: "object",
    properties: {
      parameter: {
        type: "string",
      },
      value: {
        type: "string",
      },
    },
    required: ["parameter", "value"],
    additionalProperties: false,
  },
};

const ajv = new Ajv();
const validate = ajv.compile<ParameterKV[]>(schema);

export type ParameterKV = {
  parameter: string;
  value: string;
};

export function parseAndValidate<T>(data: unknown): T {
  try {
    if (validate(data)) {
      return data as T;
    } else {
      throw { message: "Validation errors:", error: validate.errors };
    }
  } catch (error) {
    console.error("Invalid JSON:", error);
    throw { message: "Invalid JSON:", errors: error };
  }
}
