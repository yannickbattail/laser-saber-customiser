import crypto from "crypto";
import { existsSync, mkdirSync } from "node:fs";
import {
  createFctExecCommand,
  Export3dFormat,
  GenerateAnimation,
  OpenScad,
  OpenScadOutputWithSummary,
  ParameterDefinition,
  ParameterKV,
} from "openscad-cli-wrapper";
import { getDefaultOpenscadOptions } from "./utils/configuration.js";
import { cleanGenFiles } from "./utils/cleanGenFiles.js";

const options = getDefaultOpenscadOptions();
const modelFile = options.fileName;
const execOutput = createFctExecCommand(false, false);

export async function getParameterDefinition(): Promise<ParameterDefinition> {
  const openscad = new OpenScad(modelFile, options.outputDir, execOutput);
  return (await openscad.getParameterDefinition(options.openScadOptions)).parameterDefinition;
}

export async function generateModel(input: ParameterKV[]): Promise<OpenScadOutputWithSummary> {
  const outputDir = await getOutputDir(input);
  const fileName = `${outputDir}/model_model.3mf`;
  if (existsSync(fileName)) {
    return emptyOpenScadOutput(fileName);
  }
  const openscad = new OpenScad(modelFile, outputDir, execOutput);
  return await openscad.generateModel(input, Export3dFormat["3mf"], options.openScadOptions);
}

export async function generateImage(input: ParameterKV[]): Promise<OpenScadOutputWithSummary> {
  const outputDir = await getOutputDir(input);
  const fileName = `${outputDir}/model_model.png`;
  if (existsSync(fileName)) {
    return emptyOpenScadOutput(fileName);
  }
  const openscad = new OpenScad(modelFile, outputDir, execOutput);
  return await openscad.generateImage(input, options.openScadOptions);
}

export async function generateAnimation(input: ParameterKV[]): Promise<OpenScadOutputWithSummary> {
  const outputDir = await getOutputDir(input);
  const fileName = `${outputDir}/model_model.webp`;
  if (existsSync(fileName)) {
    return emptyOpenScadOutput(fileName);
  }
  const openscad = new OpenScad(modelFile, outputDir, execOutput);
  input.push({
    parameter: "animation_rotation",
    value: "true",
  });
  const param = await openscad.generateAnimation(input, options.openScadOptions);
  return await GenerateAnimation(param, options.openScadOptions.animOptions.animDelay, execOutput);
}

async function getOutputDir(input: ParameterKV[]) {
  const inputHash = hashInput(input);
  const outputDir = `${options.outputDir}/${inputHash}`;
  mkdirSync(outputDir, { recursive: true });
  return outputDir;
}

function hashInput(input: ParameterKV[]) {
  return crypto.createHash("sha256").update(JSON.stringify(input)).digest("hex");
}

export function cleanOldGenFiles() {
  setTimeout(() => cleanGenFiles(options.outputDir), 1000);
}

function emptyOpenScadOutput(fileName: string): OpenScadOutputWithSummary {
  console.log(`get file ${fileName} from cache`);
  return {
    file: fileName,
    modelFile: "",
    output: "file from cache",
    summary: {
      cache: {
        cgal_cache: {
          bytes: 0,
          entries: 0,
          max_size: 0,
        },
        geometry_cache: {
          bytes: 0,
          entries: 0,
          max_size: 0,
        },
      },
      camera: {
        distance: 0,
        fov: 0,
        rotation: [0, 0, 0],
        translation: [0, 0, 0],
      },
      geometry: {
        bounding_box: {
          max: [0, 0, 0],
          min: [0, 0, 0],
          size: [0, 0, 0],
        },
        dimensions: 0,
        facets: 0,
        simple: false,
        vertices: 0,
      },
      time: {
        hours: 0,
        milliseconds: 0,
        minutes: 0,
        seconds: 0,
        time: "",
        total: 0,
      },
    },
  };
}
