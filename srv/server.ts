import express, { Request, Response } from "express";
import { handlePreview } from "./handlers/handlePreview.js";

const app = express();
app.use(express.json());

const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/preview", (req: Request, res: Response) => {
  handlePreview(req, res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
