import express, { Request, Response } from "express";
import process from "node:process";
import {
  handle3DModel,
  handleAnimation,
  handleParameter,
  handlePreview,
} from "./handlers/openscadHandlers.js";
import { getPresets, postPresets } from "./handlers/persistenceHandler.js";

const port = process.argv.length >= 3 ? parseInt(process.argv[2]) : 8080;

const app = express();

app.use(express.json());
app.use(express.static("../src"));

app.get("/api/", (req: Request, res: Response): void => {
  res.json({ message: "API home!" });
});
app.get("/api/openscad/parameter", handleParameter);
app.post("/api/openscad/3DModel", handle3DModel);
app.post("/api/openscad/preview", handlePreview);
app.post("/api/openscad/animation", handleAnimation);

app.get("/api/persistence/preset", getPresets);
app.post("/api/persistence/preset", postPresets);

app.listen(port, () => console.log(`Listening on http://localhost:${port}/`));
