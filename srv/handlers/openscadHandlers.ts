import path from "path";
import { Request, Response } from "express";
import { OpenScadOutputWithSummary, ParameterKV } from "openscad-cli-wrapper";
import {
  cleanOldGenFiles,
  generateAnimation,
  generateImage,
  generateModel,
  getParameterDefinition,
} from "../generate.js";

export async function handleParameter(req: Request, res: Response): Promise<void> {
  const param = await getParameterDefinition();
  res.json(param);
  cleanOldGenFiles();
}

export async function handleModel3mf(req: Request, res: Response): Promise<void> {
  return handleOutput(
    req,
    res,
    async (input: ParameterKV[]): Promise<OpenScadOutputWithSummary> => await generateModel(input),
  );
}

export async function handleImage(req: Request, res: Response): Promise<void> {
  return handleOutput(
    req,
    res,
    async (input: ParameterKV[]): Promise<OpenScadOutputWithSummary> => await generateImage(input),
  );
}

export async function handleWebp(req: Request, res: Response): Promise<void> {
  return handleOutput(
    req,
    res,
    async (input: ParameterKV[]): Promise<OpenScadOutputWithSummary> => await generateAnimation(input),
  );
}

async function handleOutput(
  req: Request,
  res: Response,
  gen: (input: ParameterKV[]) => Promise<OpenScadOutputWithSummary>,
) {
  const input = IsValidParameter(req.query.p);
  const param = await gen(input);
  res.sendFile(path.join(process.cwd() + "/" + param.file));
  cleanOldGenFiles();
}

function IsValidParameter(query): ParameterKV[] {
  const p = JSON.parse(query) as Record<string, string>;
  return toKV(p);
}

function toKV(formData: Record<string, string>): ParameterKV[] {
  const data: ParameterKV[] = [];
  Object.entries(formData).forEach((e) => {
    data.push({ parameter: e[0], value: e[1] as string });
  });
  return data;
}
