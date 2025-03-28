import { Request, Response } from "express";
import { IsParameterKvValid } from "../utils/validation.js";
import { OpenScad } from "../../commons/openscad/OpenScad.js";
import { execOutput } from "../utils/execBash.js";
import { Export3dFormat } from "../../commons/openscad/OpenScadOptions.js";
import { ParameterKV } from "../../commons/openscad/ParameterSet.js";
import {
  animOptions,
  getOptions,
  imageOptions,
  modelFile,
  option3mf,
  retentionTime,
} from "../../commons/openscad/OpenScadConfiguration.js";
import { cleanGenFiles } from "../utils/cleanGenFiles.js";

export function handleRoot(req: Request, res: Response): void {
  res.json({ message: "API home!" });
}

export function handleParameter(req: Request, res: Response): void {
  const openscad = new OpenScad(modelFile, getOptions(), execOutput);
  const param = openscad.getParameterDefinition();
  res.json(param);
  setTimeout(() => cleanGenFiles(getOptions().outputDir, retentionTime), 1000);
}

export function handle3DModel(req: Request, res: Response): void {
  const input = IsParameterKvValid<ParameterKV[]>(req.body);
  const openscad = new OpenScad(modelFile, getOptions(), execOutput);
  const param = openscad.generateModel(input, Export3dFormat["3mf"], option3mf);
  res.json(param);
  setTimeout(() => cleanGenFiles(getOptions().outputDir, retentionTime), 1000);
}

export function handlePreview(req: Request, res: Response): void {
  const input = IsParameterKvValid<ParameterKV[]>(req.body);
  const openscad = new OpenScad(modelFile, getOptions(), execOutput);
  const param = openscad.generateImage(input, imageOptions);
  res.json(param);
  setTimeout(() => cleanGenFiles(getOptions().outputDir, retentionTime), 1000);
}

export function handleRenderedImage(req: Request, res: Response): void {
  const input = IsParameterKvValid<ParameterKV[]>(req.body);
  const openscad = new OpenScad(modelFile, getOptions(), execOutput);
  const param = openscad.generateImage(input, imageOptions);
  res.json(param);
  setTimeout(() => cleanGenFiles(getOptions().outputDir, retentionTime), 1000);
}

export function handleAnimation(req: Request, res: Response): void {
  const input = IsParameterKvValid<ParameterKV[]>(req.body);
  const openscad = new OpenScad(modelFile, getOptions(), execOutput);
  const param = openscad.generateAnimation(input, animOptions);
  res.json(param);
  setTimeout(() => cleanGenFiles(getOptions().outputDir, retentionTime), 1000);
}
