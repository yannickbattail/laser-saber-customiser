import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { Request, Response } from "express";

const {
  mockGetParameterDefinition,
  mockGenerateModel,
  mockGenerateImage,
  mockGenerateWebpAnimation,
  mockGenerateWebpAnimationFn,
  mockCreateExecutor,
  mockCleanGenFiles,
  mockExistsSync,
  mockMkdirSync,
} = vi.hoisted(() => ({
  mockGetParameterDefinition: vi.fn().mockResolvedValue({ parameterDefinition: { params: "definition" } }),
  mockGenerateModel: vi.fn().mockReturnValue({ file: "model.3mf" }),
  mockGenerateImage: vi.fn().mockReturnValue({ file: "image.png" }),
  mockGenerateWebpAnimation: vi.fn().mockResolvedValue({ file: "anim.png" }),
  mockGenerateWebpAnimationFn: vi.fn().mockResolvedValue({ file: "anim.gif" }),
  mockCreateExecutor: vi.fn().mockReturnValue("execOutput"),
  mockCleanGenFiles: vi.fn(),
  mockExistsSync: vi.fn().mockReturnValue(false),
  mockMkdirSync: vi.fn(),
}));

vi.mock("node:fs", () => ({
  existsSync: mockExistsSync,
  mkdirSync: mockMkdirSync,
}));

vi.mock("openscad-cli-wrapper", () => {
  const MockOpenScad = vi.fn(function () {
    return {
      getParameterDefinition: mockGetParameterDefinition,
      generateModel: mockGenerateModel,
      generateImage: mockGenerateImage,
      generateAnimation: mockGenerateWebpAnimation,
    };
  });
  return {
    OpenScad: MockOpenScad,
    createExecutor: mockCreateExecutor,
    GenerateWebpAnimation: mockGenerateWebpAnimationFn,
    Export3dFormat: { "3mf": "3mf" },
    ParameterKV: {},
    openscadParameterKvSchema: { type: "array" },
  };
});

vi.mock("../../utils/cleanGenFiles.js", () => ({
  cleanGenFiles: mockCleanGenFiles,
}));

vi.mock("../../utils/configuration.js", () => ({
  getDefaultOpenscadOptions: vi.fn().mockReturnValue({
    fileName: "test-model.scad",
    outputDir: "./test-gen",
    openScadOptions: {
      animOptions: {
        animDelay: 50,
      },
    },
  }),
}));

import path from "path";
import { handleImage, handleModel3mf, handleParameter, handleWebp } from "../../handlers/openscadHandlers.js";
import { OpenScad } from "openscad-cli-wrapper";

function expectedFilePath(file: string): string {
  return path.join(process.cwd() + "/" + file);
}

function createMockReqRes(param: unknown = {}): { req: Request; res: Response } {
  const req = {
    body: {},
    query: {
      p: JSON.stringify(param),
    },
  } as unknown as Request;
  const res = {
    json: vi.fn(),
    sendFile: vi.fn(),
  } as unknown as Response;
  return { req, res };
}

describe("handlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  describe("handleParameter", () => {
    it("should call OpenScad.getParameterDefinition and return result", async () => {
      const { req, res } = createMockReqRes();
      await handleParameter(req, res);

      expect(OpenScad).toHaveBeenCalledWith("test-model.scad", "./test-gen", "execOutput");
      expect(mockGetParameterDefinition).toHaveBeenCalled();
      expect(res.json as Mock).toHaveBeenCalledWith({ params: "definition" });
    });

    it("should schedule cleanGenFiles after timeout", async () => {
      const { req, res } = createMockReqRes();
      await handleParameter(req, res);

      expect(mockCleanGenFiles).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1000);
      expect(mockCleanGenFiles).toHaveBeenCalledWith("./test-gen");
    });
  });

  describe("handle3DModel", () => {
    it("should convert input, generate model and send file", async () => {
      const { req, res } = createMockReqRes({ height: "10" });
      await handleModel3mf(req, res);

      expect(OpenScad).toHaveBeenCalledWith(
        "test-model.scad",
        "./test-gen/f5385d466143864bc5c60d45e4d4963fd7008540d65c8cd3af74002d08c8232a",
        "execOutput",
      );
      expect(mockGenerateModel).toHaveBeenCalledWith(
        [
          { parameter: "height", value: "10" },
          { parameter: "$fn", value: "100" },
        ],
        "3mf",
        expect.any(Object),
      );
      expect(res.sendFile as Mock).toHaveBeenCalledWith(expectedFilePath("model.3mf"));
    });

    it("should schedule cleanGenFiles after timeout", async () => {
      const { req, res } = createMockReqRes({});
      await handleModel3mf(req, res);

      vi.advanceTimersByTime(1000);
      expect(mockCleanGenFiles).toHaveBeenCalledWith("./test-gen");
    });
  });

  describe("handlePreview", () => {
    it("should convert input, generate image and send file", async () => {
      const { req, res } = createMockReqRes({ width: "5" });
      await handleImage(req, res);

      expect(OpenScad).toHaveBeenCalledWith(
        "test-model.scad",
        "./test-gen/e867f69c30da9260067c9dcb79eaad24c6f5ff3ed2f08fdd114fda3311070b08",
        "execOutput",
      );
      expect(mockGenerateImage).toHaveBeenCalledWith([{ parameter: "width", value: "5" }], expect.any(Object));
      expect(res.sendFile as Mock).toHaveBeenCalledWith(expectedFilePath("image.png"));
    });

    it("should schedule cleanGenFiles after timeout", async () => {
      const { req, res } = createMockReqRes({});
      await handleImage(req, res);

      vi.advanceTimersByTime(1000);
      expect(mockCleanGenFiles).toHaveBeenCalledWith("./test-gen");
    });
  });

  describe("handleAnimation", () => {
    it("should convert input, add animation_rotation param, generate animation and send file", async () => {
      const { req, res } = createMockReqRes({ color: "red" });
      await handleWebp(req, res);

      expect(mockGenerateWebpAnimation).toHaveBeenCalledWith(
        expect.arrayContaining([
          { parameter: "color", value: "red" },
          { parameter: "animation_rotation", value: "true" },
        ]),
        expect.any(Object),
      );
      expect(mockGenerateWebpAnimationFn).toHaveBeenCalledWith({ file: "anim.png" }, 50, false, "execOutput");
      expect(res.sendFile as Mock).toHaveBeenCalledWith(expectedFilePath("anim.gif"));
    });

    it("should schedule cleanGenFiles after timeout", async () => {
      const { req, res } = createMockReqRes({});
      await handleWebp(req, res);

      vi.advanceTimersByTime(1000);
      expect(mockCleanGenFiles).toHaveBeenCalledWith("./test-gen");
    });
  });

  describe("createExecutor", () => {
    it("should pass execOutput from createExecutor to OpenScad constructor", () => {
      const { req, res } = createMockReqRes();
      handleParameter(req, res);
      // The third argument to OpenScad is the return value of createExecutor(false, false)
      expect(OpenScad).toHaveBeenCalledWith("test-model.scad", "./test-gen", "execOutput");
    });
  });
});
