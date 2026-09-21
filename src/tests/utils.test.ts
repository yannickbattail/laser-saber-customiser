import { describe, expect, it } from "vitest";
import { camelToHuman, toTitle } from "../utils";

describe("utils", () => {
  it("toTitle() should capitalize first letter", async () => {
    expect(toTitle("test")).toBe("Test");
    expect(toTitle("test machin, truc")).toBe("Test machin, truc");
  });
  it("camelToHuman() should convert camelcase string to human string", async () => {
    expect(camelToHuman("testPoulet")).toBe("test poulet");
    expect(camelToHuman("testMachin, truc")).toBe("test machin, truc");
    expect(camelToHuman("loutre:testMachin")).toBe("loutre:test machin");
  });
});
