import { Request, Response } from "express";
import { getOpenscadParameters } from "../utils/openscad.js";
// import { IsParameterListValid } from "../utils/validation.js";

export function handleParameter(req: Request, res: Response): void {
  const ret = getOpenscadParameters();
  // res.json(IsParameterListValid(ret));
  res.json(ret);
}
