export class ParameterSet {
  public parameterSets: Record<string, Record<string, string>> = {};
  public fileFormatVersion: "1" = "1" as const;
  constructor(p?: object | null) {
    if (p) {
      Object.assign(this, p);
    }
  }

  public add(name: string, paramKV: ParameterKV[]) {
    this.parameterSets[name] = {};
    for (const p of paramKV) {
      this.parameterSets[name][p.parameter] = p.value;
    }
  }

  public static toParameterSet(
    paramKV: ParameterKV[],
    name: string = "model",
  ): ParameterSet {
    const parameterSet = new ParameterSet();
    parameterSet.add(name, paramKV);
    return parameterSet;
  }
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
