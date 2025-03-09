export type ParameterSet = {
  parameterSets: Record<string, Record<string, string>>;
  fileFormatVersion: "1";
};

export interface OptionNumber {
  name: string;
  value: number;
}

export interface OptionString {
  name: string;
  value: string;
}

export interface ParameterBase {
  name: string;
  caption?: string;
  group?: string;
}

export interface ParameterNumber extends ParameterBase {
  type: "number";
  initial: number | number[];
  options?: OptionNumber[];
  max?: number;
  min?: number;
  step?: number;
}

export interface ParameterString extends ParameterBase {
  type: "string";
  initial: string;
  options?: OptionString[];
  maxLength?: number;
}

export interface ParameterBoolean extends ParameterBase {
  type: "boolean";
  initial: boolean;
}

export interface ParameterList {
  parameters: (ParameterNumber | ParameterString | ParameterBoolean)[];
  title: string;
}
