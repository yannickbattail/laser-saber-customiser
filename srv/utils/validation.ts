import Ajv, { JSONSchemaType } from "ajv";
import { ParameterList } from "./openscadTypes";

const parameterKvSchema: JSONSchemaType<ParameterKV[]> = {
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

const parameterListSchema: JSONSchemaType<ParameterList> = {
  anyOf: [],
  oneOf: [],
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "ParameterList",
  type: "object",
  properties: {
    parameters: {
      type: "array",
      items: {
        oneOf: [
          {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              caption: {
                type: "string",
              },
              group: {
                type: "string",
              },
              type: {
                type: "string",
                enum: ["number"],
              },
              initial: {
                oneOf: [
                  {
                    type: "number",
                  },
                  {
                    type: "array",
                    items: {
                      type: "number",
                    },
                  },
                ],
              },
              options: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                    value: {
                      type: "number",
                    },
                  },
                  required: ["name", "value"],
                },
              },
              max: {
                type: "number",
              },
              min: {
                type: "number",
              },
              step: {
                type: "number",
              },
            },
            required: ["name", "type", "initial"],
          },
          {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              caption: {
                type: "string",
              },
              group: {
                type: "string",
              },
              type: {
                type: "string",
                enum: ["string"],
              },
              initial: {
                type: "string",
              },
              options: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                    value: {
                      type: "string",
                    },
                  },
                  required: ["name", "value"],
                },
              },
              maxLength: {
                type: "number",
              },
            },
            required: ["name", "type", "initial"],
          },
          {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              caption: {
                type: "string",
              },
              group: {
                type: "string",
              },
              type: {
                type: "string",
                enum: ["boolean"],
              },
              initial: {
                type: "boolean",
              },
            },
            required: ["name", "type", "initial"],
          },
        ],
      },
    },
    title: {
      type: "string",
    },
  },
  required: ["parameters", "title"],
};

const ajv = new Ajv();
const validateParameterKV = ajv.compile<ParameterKV[]>(parameterKvSchema);
// const validateParameterList = ajv.compile<ParameterList>(parameterListSchema);

export type ParameterKV = {
  parameter: string;
  value: string;
};

export function IsParameterKvValid<T>(data: unknown): T {
  try {
    if (validateParameterKV(data)) {
      return data as T;
    } else {
      throw {
        message: "Validation errors:",
        error: validateParameterKV.errors,
      };
    }
  } catch (error) {
    console.error("Invalid JSON:", error);
    throw { message: "Invalid JSON:", errors: error };
  }
}

//
// export function IsParameterListValid<T>(data: unknown): T {
//   try {
//     if (validateParameterList(data)) {
//       return data as T;
//     } else {
//       throw {
//         message: "Validation errors:",
//         error: validateParameterList.errors,
//       };
//     }
//   } catch (error) {
//     console.error("Invalid JSON:", error);
//     throw { message: "Invalid JSON:", errors: error };
//   }
// }
