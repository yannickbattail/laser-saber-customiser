import express, { Request, Response } from "express";
import { handlePreview } from "./handlers/handlePreview.js";
import { handleAnimation } from "./handlers/handleAnimation.js";
import { handleParameter } from "./handlers/handleParameter.js";

const app = express();
app.use(express.json());

const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/preview", handlePreview);
app.post("/parameter", handleParameter);
app.post("/animation", handleAnimation);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
