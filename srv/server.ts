import express from "express";
import {
  handleAnimation,
  handleParameter,
  handlePreview,
  handleRoot,
} from "./handlers/handlers.js";

const port = process.argv.length >= 3 ? parseInt(process.argv[2]) : 3000;

const app = express();

app.use(express.json());
app.use(express.static("../dist"));

app.get("/api/", handleRoot);
app.get("/api/parameter", handleParameter);
app.post("/api/preview", handlePreview);
app.post("/api/animation", handleAnimation);

app.listen(port, () => console.log(`Listening on http://localhost:${port}/`));
