import { Db } from "../persistence/db.js";
import { Request, Response } from "express";
import { PresetRepository } from "../persistence/presets/PresetRepository.js";
import { IPresetRepository } from "../persistence/presets/IPresetRepository.js";

const presetRepo: IPresetRepository = new PresetRepository(new Db("./db"));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getUserId(req: Request): string {
  return "user1";
}

export function getPresets(req: Request, res: Response): void {
  res.json(presetRepo.getPresets(getUserId(req)));
}

export async function postPreset(req: Request, res: Response): Promise<void> {
  const namedPreset = req.body.name as string;
  const preset = req.body.preset as Record<string, string>;
  res.json(await presetRepo.savePreset(getUserId(req), namedPreset, preset));
}

export async function deletePreset(req: Request, res: Response): Promise<void> {
  const namedPreset = req.body.name as string;
  res.json(await presetRepo.deletePreset(getUserId(req), namedPreset));
}
