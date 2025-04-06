import { z, ZodEnum, ZodNumber, ZodString, ZodBoolean } from "zod";

import {
  ParameterBase,
  ParameterBoolean,
  ParameterDefinition,
  ParameterNumber,
  ParameterNumberOption,
  ParameterString,
  ParameterStringOption,
} from "./ParameterDefinition";

export function ParameterDefToZod(paramDef: ParameterDefinition) {
  const zodObj: Record<
    string,
    ZodEnum<[string, ...string[]]> | ZodNumber | ZodString | ZodBoolean
  > = {};
  paramDef.parameters.forEach((p) => {
    zodObj[p.name] = paramToZod(p);
  });
  return z.object(zodObj);
}

function paramToZod(
  p:
    | ParameterNumber
    | ParameterNumberOption
    | ParameterString
    | ParameterStringOption
    | ParameterBoolean,
): ZodEnum<[string, ...string[]]> | ZodNumber | ZodString | ZodBoolean {
  if ("options" in p) {
    if (p.type === "number") return paramEnumNumber(p);
    else if (p.type === "string") return paraEnumString(p);
  }
  switch (p.type) {
    case "number":
      return paramNumber(p);
    case "string":
      return paramString(p);
    case "boolean":
      return paramBoolean(p);
  }
}

function paramEnumNumber(
  p: ParameterNumberOption,
): ZodEnum<[string, ...string[]]> {
  const VALUES: [string, ...string[]] = [
    p.options[0].value.toString(),
    ...p.options.slice(1).map((p) => p.value.toString()),
  ];
  return z.enum(VALUES, getErrorMessage(p));
}

function paraEnumString(
  p: ParameterStringOption,
): ZodEnum<[string, ...string[]]> {
  const VALUES: [string, ...string[]] = [
    p.options[0].value,
    ...p.options.slice(1).map((p) => p.value),
  ];
  return z.enum(VALUES, getErrorMessage(p));
}

function paramNumber(p: ParameterNumber | ParameterNumberOption): ZodNumber {
  let zodNumber = z.number(getErrorMessage(p));
  if (p.min !== undefined) zodNumber = zodNumber.min(p.min);
  if (p.max !== undefined) zodNumber = zodNumber.max(p.max);
  if (p.step !== undefined) zodNumber = zodNumber.step(p.step);
  return zodNumber;
}

function paramString(p: ParameterString): ZodString {
  let zodString = z.string(getErrorMessage(p));
  if (p.maxLength) zodString = zodString.max(p.maxLength);
  return zodString;
}

function paramBoolean(p: ParameterBoolean): ZodBoolean {
  return z.boolean(getErrorMessage(p));
}

function getErrorMessage(p: ParameterBase) {
  return {
    required_error: `[${p.group}] '${p.caption}' (${p.name}) is required`,
    invalid_type_error: `[${p.group}] '${p.caption}' (${p.name}) must be a ${"type" in p ? p.type : "object"}`,
  };
}
