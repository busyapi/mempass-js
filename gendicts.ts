const fs = require("fs");
const path = require("path");
const readline = require("node:readline");

const inDir = path.join(__dirname, "dicts");
const outDir = path.join(__dirname, "src/dicts");

fs.readdir(inDir, (err: Error, files: string[]) => {
  if (err) {
    console.log(err.message);
    return;
  }

  for (const file of files) {
    if (path.extname(file) !== ".txt") {
      return;
    }

    const words: string[][] = [];

    const writer = fs.createWriteStream(path.join(outDir, file.replace(".txt", ".js")));
    writer.write("export default ");

    const rl = readline.createInterface({
      input: fs.createReadStream(path.join(inDir, file)),
      crlfDelay: Infinity,
    });

    rl.on("line", (line: string) => {
      if (line === "") {
        return;
      }

      const len = line.length;
      if (!words[len]) {
        words[len] = [];
      }

      words[len].push(line);
    });

    rl.on("close", () => {
      writer.write(JSON.stringify(words) + ";\n");
      writer.close();
    });
  }
});
