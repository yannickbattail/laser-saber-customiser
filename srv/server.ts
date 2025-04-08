import express, { NextFunction, Request, Response } from "express";
import process from "node:process";
import {
  handle3DModel,
  handleAnimation,
  handleParameter,
  handlePreview,
} from "./handlers/openscadHandlers.js";
import { getPresets, postPresets } from "./handlers/persistenceHandler.js";
import { ZodError } from "zod";

const port = process.argv.length >= 3 ? parseInt(process.argv[2]) : 8080;

const app = express();

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    console.error("Invalid Zod", err);
    res.status(400).json(err);
  } else if (err instanceof SyntaxError) {
    console.error("Invalid JSON", err);
    res.status(400).send({ error: "Invalid JSON" });
  } else {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  }
};

app.use(express.json());
app.use(express.static("../src"));
app.use(errorHandler);

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
