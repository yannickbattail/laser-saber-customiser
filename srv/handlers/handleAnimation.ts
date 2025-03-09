import { ParameterKV, parseAndValidate } from "../validation.js";
import { Request, Response } from "express";
import { buildParameterSet, generateOpenscadAnim } from "../utils/openscad.js";

export function handleAnimation(req: Request, res: Response): void {
  const input = parseAndValidate<ParameterKV[]>(req.body);
  const parameterSet = buildParameterSet(input);
  const ret = generateOpenscadAnim(parameterSet);
  res.sendFile(ret, { root: "./" });
}
