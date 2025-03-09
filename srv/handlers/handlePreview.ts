import { ParameterKV, parseAndValidate } from "../validation.js";
import { Request, Response } from "express";
import { buildParameterSet, generateOpenscadImage } from "../utils/openscad.js";

export function handlePreview(req: Request, res: Response): void {
  const input = parseAndValidate<ParameterKV[]>(req.body);
  const parameterSet = buildParameterSet(input);
  const ret = generateOpenscadImage(parameterSet);
  res.json({ success: true, message: ret });
}
