import { JSONFilePreset } from "lowdb/node";
import { mkdirSync } from "node:fs";
import { Low } from "lowdb";
import { DbStructure } from "./DbStructure.js";
import { PresetDb } from "./presets/PresetDb.js";

export class Db {
  private db: Low<DbStructure> | undefined;

  constructor(private dbPath: string = "./db") {}

  public async save() {
    await this.db?.write();
  }

  public async getPresets(): Promise<PresetDb[]> {
    return (await this.getData()).data.presets;
  }

  public async getUsers() {
    return (await this.getData()).data.users;
  }

  private async getData(): Promise<Low<DbStructure>> {
    if (!this.db) {
      const defaultData: DbStructure = { presets: [], users: [] };
      mkdirSync(this.dbPath, { recursive: true });
      this.db = await JSONFilePreset<DbStructure>(
        `${this.dbPath}/data.json`,
        defaultData,
      );
      await this.db.read();
    }
    return this.db;
  }
}
