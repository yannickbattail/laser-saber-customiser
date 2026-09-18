import { describe, expect, it, vi, beforeEach } from "vitest";
import { PersistenceApi } from "../serverApi/PersistenceApi";
import { ParameterSet } from "openscad-cli-wrapper/dist/src/types/ParameterSet.js";

describe("PersistenceApi", () => {
  let api: PersistenceApi;

  beforeEach(() => {
    api = new PersistenceApi();
    vi.restoreAllMocks();
  });

  it("should get user preset via GET request", async () => {
    const mockUserPreset = {
      id: "preset-1",
      createdAt: 1000,
      updatedAt: 2000,
      userId: "user1",
      preset: new ParameterSet({
        fileFormatVersion: "1",
        parameterSets: {
          test: { height: "10" },
        },
      }),
    };

    const mockFetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockUserPreset),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await api.getPresets();
    expect(mockFetch).toHaveBeenCalledWith("/api/persistence/preset");
    expect(result).toEqual(mockUserPreset);
  });

  it("should save preset via POST request", async () => {
    const mockUserPreset = {
      id: "preset-1",
      createdAt: 1000,
      updatedAt: 2000,
      userId: "user1",
      preset: new ParameterSet({
        fileFormatVersion: "1",
        parameterSets: {
          myPreset: { length: "20" },
        },
      }),
    };

    const mockFetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockUserPreset),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await api.savePreset("myPreset", { length: "20" });
    expect(mockFetch).toHaveBeenCalledWith("/api/persistence/preset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "myPreset", preset: { length: "20" } }),
    });
    expect(result).toEqual(mockUserPreset);
  });

  it("should delete preset via DELETE request", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({}),
    });
    vi.stubGlobal("fetch", mockFetch);

    await api.deletePreset("myPreset");
    expect(mockFetch).toHaveBeenCalledWith("/api/persistence/preset", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "myPreset" }),
    });
  });
});
