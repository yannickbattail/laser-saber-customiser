import fs from "fs";
import path from "path";

export function cleanGenFiles(
  directory = "../src/gen",
  retentionTime: number = 10 * 60 * 1000,
) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      fs.stat(filePath, (err, stats) => {
        if (err) throw err;

        const now = Date.now();
        const fileAge = now - stats.mtimeMs;

        if (fileAge > retentionTime) {
          fs.unlink(filePath, (err) => {
            if (err) throw err;
            console.log(`Deleted: ${filePath}`);
          });
        }
      });
    });
  });
}
