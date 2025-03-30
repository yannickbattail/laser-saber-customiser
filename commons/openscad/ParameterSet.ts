export class ParameterSet {
  public parameterSets: Record<string, Record<string, string>> = {};
  public fileFormatVersion: "1" = "1" as const;
}

export type ParameterKV = {
  parameter: string;
  value: string;
};

export type ParameterFileSet = {
  parameterFile: string;
  parameterName: string;
};

export type ParameterSetName = {
  parameterSet: ParameterSet;
  parameterName: string;
};
