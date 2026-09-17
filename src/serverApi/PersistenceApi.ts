import { UserPreset } from "../UserPreset";
import { IPersistenceApi } from "./IPersistenceApi";

export { UserPreset };

export class PersistenceApi implements IPersistenceApi {
  async getPresets(): Promise<UserPreset> {
    const res = await fetch("/api/persistence/preset");
    return (await res.json()) as UserPreset;
  }

  async savePreset(name: string, preset: Record<string, string>): Promise<Record<string, string>> {
    const res = await fetch("/api/persistence/preset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, preset }),
    });
    return (await res.json()) as Record<string, string>;
  }

  async deletePreset(name: string): Promise<void> {
    await fetch("/api/persistence/preset", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
  }
}
