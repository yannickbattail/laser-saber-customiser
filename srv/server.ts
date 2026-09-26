import process from "node:process";
import express, { NextFunction, Request, Response } from "express";
import qs from "qs";
import { handleImage, handleModel3mf, handleParameter, handleWebp } from "./handlers/openscadHandlers.js";

const port = process.argv.length >= 3 ? parseInt(process.argv[2]) : 8080;

const app = express();

app.set("query parser", (queryString) => {
  return qs.parse(queryString, {
    parameterLimit: 10_000,
    arrayLimit: 10_000,
    throwOnLimitExceeded: true,
  });
});

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (err instanceof SyntaxError) {
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
app.get("/api/openscad/model.3mf", handleModel3mf);
app.get("/api/openscad/image.png", handleImage);
app.get("/api/openscad/animation.webp", handleWebp);

// disable for now, because it not (yet) used int the frontend
// app.get("/api/persistence/preset", getPresets);
// app.post("/api/persistence/preset", postPreset);
// app.delete("/api/persistence/preset", deletePreset);

app.listen(port, () => console.log(`Listening on http://localhost:${port}/`));
