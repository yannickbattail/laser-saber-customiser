import { Request, Response } from "express";
import { IsParameterKvValid } from "../utils/validation.js";
import { createFctExecCommand, GenerateAnimation, OpenScad } from "openscad-cli-wrapper";
import { Export3dFormat } from "openscad-cli-wrapper";
import { ParameterKV } from "openscad-cli-wrapper";
import { cleanGenFiles } from "../utils/cleanGenFiles.js";
import { getDefaultOpenscadOptions } from "../utils/configuration.js";

const options = getDefaultOpenscadOptions();
const modelFile = options.fileName;
const execOutput = createFctExecCommand(false, false);

export function handleRoot(req: Request, res: Response): void {
  res.json({ message: "API home!" });
}

const cleanOldGenFiles = () => {
  setTimeout(() => cleanGenFiles(options.outputDir), 1000);
};

export function handleParameter(req: Request, res: Response): void {
  const openscad = new OpenScad(modelFile, options.outputDir, execOutput);
  const param = openscad.getParameterDefinition(options.openScadOptions);
  res.json(param);
  cleanOldGenFiles();
}

export function handle3DModel(req: Request, res: Response): void {
  const input = IsParameterKvValid<ParameterKV[]>(req.body);
  const openscad = new OpenScad(modelFile, options.outputDir, execOutput);
  const param = openscad.generateModel(input, Export3dFormat["3mf"], options.openScadOptions);
  res.json(param);
  cleanOldGenFiles();
}

export function handlePreview(req: Request, res: Response): void {
  const input = IsParameterKvValid<ParameterKV[]>(req.body);
  const openscad = new OpenScad(modelFile, options.outputDir, execOutput);
  const param = openscad.generateImage(input, options.openScadOptions);
  res.json(param);
  cleanOldGenFiles();
}

export async function handleAnimation(req: Request, res: Response): Promise<void> {
  const input = IsParameterKvValid<ParameterKV[]>(req.body);
  input.push({
    parameter: "animation_rotation",
    value: "true",
  });
  const openscad = new OpenScad(modelFile, options.outputDir, execOutput);
  let param = await openscad.generateAnimation(input, options.openScadOptions);
  param = await GenerateAnimation(param, options.openScadOptions.animOptions.animDelay, execOutput);
  res.json(param);
  cleanOldGenFiles();
}
