/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs-extra";
import path from "path";

interface FileInfo {
  pathfile: string;
  content: string;
  extension: string;
}

async function readDirectoryRecursive(
  dir: string,
  baseDir: string
): Promise<FileInfo[]> {
  let results: FileInfo[] = [];
  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      results = results.concat(await readDirectoryRecursive(fullPath, baseDir));
    } else {
      const content = await fs.readFile(fullPath);
      const extension = path.extname(fullPath).slice(1);
      const base64Content = content.toString("base64");
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/"); // Ubah path backslash menjadi slash

      results.push({
        pathfile: `/${relativePath}`,
        content: base64Content,
        extension,
      });
    }
  }

  return results;
}

async function writeToFile(filePath: string, data: any) {
  const content = `const bundledObject = ${JSON.stringify(
    data,
    null,
    2
  )};\nexport default bundledObject;`;
  await fs.outputFile(filePath, content);
}

(async () => {
  try {
    const distPath = path.resolve(__dirname, "dist");
    const fileInfos = await readDirectoryRecursive(distPath, distPath);
    const fineFormat = fileInfos.reduce((saved, row) => {
      saved[row.pathfile] = {
        content: row.content,
        extension: row.extension,
      };
      return saved;
    }, {});
    const outputFilePath = path.resolve(__dirname, "assets.ts");
    await writeToFile(outputFilePath, fineFormat);
    console.log(`Data saved to ${outputFilePath}`);
  } catch (error) {
    console.error("Error processing files:", error);
  }
})();
