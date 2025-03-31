import express from "express";
import process from "node:process";
import {
  handle3DModel,
  handleAnimation,
  handleParameter,
  handlePreview,
  handleRoot,
} from "./handlers/handlers.js";

const port = process.argv.length >= 3 ? parseInt(process.argv[2]) : 8080;

const app = express();

app.use(express.json());
app.use(express.static("../src"));

app.get("/api/", handleRoot);
app.get("/api/parameter", handleParameter);
app.post("/api/3DModel", handle3DModel);
app.post("/api/preview", handlePreview);
app.post("/api/animation", handleAnimation);

app.listen(port, () => console.log(`Listening on http://localhost:${port}/`));
