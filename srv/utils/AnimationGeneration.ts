import { execOutput } from "./execBash.js";
import { OpenScadOutputWithSummary } from "laser-saber-customiser-commons/openscad/OpenScadOutput.js";

export function GenerateAnimation(
  output: OpenScadOutputWithSummary,
  animDelay: number,
) {
  const animImagesPattern = output.file;
  output.file = animImagesPattern.replace("*.png", ".webp");
  output.output += execOutput(
    `img2webp -o "${output.file}" -d "${animDelay}" ${animImagesPattern}`,
  );
  output.output += execOutput(`rm ${animImagesPattern}`);
  return output;
}
