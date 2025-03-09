import { IsParameterKvValid, ParameterKV } from "../utils/validation.js";
import { Request, Response } from "express";
import { buildParameterSet, generateOpenscadImage } from "../utils/openscad.js";

export function handlePreview(req: Request, res: Response): void {
  const input = IsParameterKvValid<ParameterKV[]>(req.body);
  const parameterSet = buildParameterSet(input);
  const ret = generateOpenscadImage(parameterSet);
  res.sendFile(ret, { root: "./" });
}
