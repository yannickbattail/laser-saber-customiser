import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { Request, Response } from "express";

const {
  mockGetParameterDefinition,
  mockGenerateModel,
  mockGenerateImage,
  mockGenerateAnimation,
  mockGenerateAnimationFn,
  mockCreateFctExecCommand,
  mockCleanGenFiles,
} = vi.hoisted(() => ({
  mockGetParameterDefinition: vi.fn().mockReturnValue({ params: "definition" }),
  mockGenerateModel: vi.fn().mockReturnValue({ file: "model.3mf" }),
  mockGenerateImage: vi.fn().mockReturnValue({ file: "image.png" }),
  mockGenerateAnimation: vi.fn().mockResolvedValue({ file: "anim.png" }),
  mockGenerateAnimationFn: vi.fn().mockResolvedValue({ file: "anim.gif" }),
  mockCreateFctExecCommand: vi.fn().mockReturnValue("execOutput"),
  mockCleanGenFiles: vi.fn(),
}));

vi.mock("openscad-cli-wrapper", () => {
  const MockOpenScad = vi.fn(function () {
    return {
      getParameterDefinition: mockGetParameterDefinition,
      generateModel: mockGenerateModel,
      generateImage: mockGenerateImage,
      generateAnimation: mockGenerateAnimation,
    };
  });
  return {
    OpenScad: MockOpenScad,
    createFctExecCommand: mockCreateFctExecCommand,
    GenerateAnimation: mockGenerateAnimationFn,
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

vi.mock("../../utils/validation.js", () => ({
  IsParameterKvValid: vi.fn().mockImplementation((data: unknown) => data),
}));

import { handleRoot, handleParameter, handle3DModel, handlePreview, handleAnimation } from "../../handlers/handlers.js";
import { OpenScad } from "openscad-cli-wrapper";
import { IsParameterKvValid } from "../../utils/validation.js";

function createMockReqRes(body: unknown = {}): { req: Request; res: Response } {
  const req = { body } as Request;
  const res = {
    json: vi.fn(),
  } as unknown as Response;
  return { req, res };
}

describe("handlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  describe("handleRoot", () => {
    it("should return API home message", () => {
      const { req, res } = createMockReqRes();
      handleRoot(req, res);
      expect(res.json as Mock).toHaveBeenCalledWith({ message: "API home!" });
    });
  });

  describe("handleParameter", () => {
    it("should call OpenScad.getParameterDefinition and return result", () => {
      const { req, res } = createMockReqRes();
      handleParameter(req, res);

      expect(OpenScad).toHaveBeenCalledWith("test-model.scad", "./test-gen", "execOutput");
      expect(mockGetParameterDefinition).toHaveBeenCalled();
      expect(res.json as Mock).toHaveBeenCalledWith({ params: "definition" });
    });

    it("should schedule cleanGenFiles after timeout", () => {
      const { req, res } = createMockReqRes();
      handleParameter(req, res);

      expect(mockCleanGenFiles).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1000);
      expect(mockCleanGenFiles).toHaveBeenCalledWith("./test-gen");
    });
  });

  describe("handle3DModel", () => {
    it("should validate input, generate model and return result", () => {
      const body = [{ parameter: "height", value: "10" }];
      const { req, res } = createMockReqRes(body);
      handle3DModel(req, res);

      expect(IsParameterKvValid).toHaveBeenCalledWith(body);
      expect(OpenScad).toHaveBeenCalledWith("test-model.scad", "./test-gen", "execOutput");
      expect(mockGenerateModel).toHaveBeenCalledWith(body, "3mf", expect.any(Object));
      expect(res.json as Mock).toHaveBeenCalledWith({ file: "model.3mf" });
    });

    it("should schedule cleanGenFiles after timeout", () => {
      const { req, res } = createMockReqRes([]);
      handle3DModel(req, res);

      vi.advanceTimersByTime(1000);
      expect(mockCleanGenFiles).toHaveBeenCalledWith("./test-gen");
    });
  });

  describe("handlePreview", () => {
    it("should validate input, generate image and return result", () => {
      const body = [{ parameter: "width", value: "5" }];
      const { req, res } = createMockReqRes(body);
      handlePreview(req, res);

      expect(IsParameterKvValid).toHaveBeenCalledWith(body);
      expect(OpenScad).toHaveBeenCalledWith("test-model.scad", "./test-gen", "execOutput");
      expect(mockGenerateImage).toHaveBeenCalledWith(body, expect.any(Object));
      expect(res.json as Mock).toHaveBeenCalledWith({ file: "image.png" });
    });

    it("should schedule cleanGenFiles after timeout", () => {
      const { req, res } = createMockReqRes([]);
      handlePreview(req, res);

      vi.advanceTimersByTime(1000);
      expect(mockCleanGenFiles).toHaveBeenCalledWith("./test-gen");
    });
  });

  describe("handleAnimation", () => {
    it("should validate input, add animation_rotation param, generate animation and return result", async () => {
      const body = [{ parameter: "color", value: "red" }];
      const { req, res } = createMockReqRes(body);
      await handleAnimation(req, res);

      expect(IsParameterKvValid).toHaveBeenCalledWith(body);
      expect(mockGenerateAnimation).toHaveBeenCalledWith(
        expect.arrayContaining([
          { parameter: "color", value: "red" },
          { parameter: "animation_rotation", value: "true" },
        ]),
        expect.any(Object),
      );
      expect(mockGenerateAnimationFn).toHaveBeenCalledWith({ file: "anim.png" }, 50, "execOutput");
      expect(res.json as Mock).toHaveBeenCalledWith({ file: "anim.gif" });
    });

    it("should schedule cleanGenFiles after timeout", async () => {
      const { req, res } = createMockReqRes([]);
      await handleAnimation(req, res);

      vi.advanceTimersByTime(1000);
      expect(mockCleanGenFiles).toHaveBeenCalledWith("./test-gen");
    });
  });

  describe("createFctExecCommand", () => {
    it("should pass execOutput from createFctExecCommand to OpenScad constructor", () => {
      const { req, res } = createMockReqRes();
      handleParameter(req, res);
      // The third argument to OpenScad is the return value of createFctExecCommand(false, false)
      expect(OpenScad).toHaveBeenCalledWith("test-model.scad", "./test-gen", "execOutput");
    });
  });
});
