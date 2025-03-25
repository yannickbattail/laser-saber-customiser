import { Request, Response } from "express";
import { IsParameterKvValid } from "../utils/validation.js";
import {
  buildParameterSet,
  generateF3dImage,
  generateOpenscad3DModel,
  generateOpenscadAnim,
  generateOpenscadImage,
  getOpenscadParameters,
} from "../utils/openscad.js";
import { ParameterKV } from "../../commons/types/ParameterKV.js";

// import { IsParameterListValid } from "../utils/validation.js";

export function handleRoot(req: Request, res: Response): void {
  res.json({ message: "API home!" });
}

export function handleParameter(req: Request, res: Response): void {
  const ret = getOpenscadParameters();
  // res.json(IsParameterListValid(ret));
  res.json(ret);
}

export function handle3DModel(req: Request, res: Response): void {
  const input = IsParameterKvValid<ParameterKV[]>(req.body);
  const parameterSet = buildParameterSet(input);
  const ret = generateOpenscad3DModel(parameterSet);
  res.json(ret.replace("../src", ""));
}

export function handlePreview(req: Request, res: Response): void {
  const input = IsParameterKvValid<ParameterKV[]>(req.body);
  const parameterSet = buildParameterSet(input);
  const ret = generateOpenscadImage(parameterSet);
  res.json(ret.replace("../src", ""));
}

export function handleRenderedImage(req: Request, res: Response): void {
  const input = IsParameterKvValid<ParameterKV[]>(req.body);
  const parameterSet = buildParameterSet(input);
  const ret = generateF3dImage(parameterSet);
  res.json(ret.replace("../src", ""));
}

export function handleAnimation(req: Request, res: Response): void {
  const input = IsParameterKvValid<ParameterKV[]>(req.body);
  const parameterSet = buildParameterSet(input);
  const ret = generateOpenscadAnim(parameterSet);
  res.json(ret.replace("../src", ""));
}
