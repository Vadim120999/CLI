import { Command } from "commander";
import fs from "fs";
import { pipeline } from "stream";
import { performTask, streamTransform } from "../tasks/task1.js";
import { handleConsoleInput } from "../utils/consoleHandler.js";

const program = new Command();

program
  .option("-i, --input <file>", "Input file")
  .option("-o, --output <file>", "Output file")
  .requiredOption("-t, --task <task>", "Task to perform")
  .parse(process.argv);

const options = program.opts();

if (options.input) {
  if (
    !fs.existsSync(options.input) ||
    fs.statSync(options.input).isDirectory()
  ) {
    console.error("Error: Input file does not exist or is a directory.");
    process.exit(1);
  }
}

if (
  options.output &&
  fs.existsSync(options.output) &&
  fs.statSync(options.output).isDirectory()
) {
  console.error("Error: Output file is a directory.");
  process.exit(1);
}

if (!options.input && !options.output) {
  console.log("введите значения в терминал");
  const transformStream = streamTransform(options.task);

  pipeline(process.stdin, transformStream, process.stdout, (err) => {
    if (err) {
      console.error("Pipeline error:", err);
      process.exit(1);
    }
  });
} else if (!options.input) {
  handleConsoleInput((input) => {
    const result = performTask(input, options.task);
    if (options.output) {
      fs.writeFileSync(options.output, result);
    } else {
      console.log(result);
    }
  });
} else {
  const readStream = fs.createReadStream(options.input);
  const writeStream = options.output
    ? fs.createWriteStream(options.output)
    : process.stdout;

  pipeline(readStream, streamTransform(options.task), writeStream, (err) => {
    if (err) {
      console.error("Pipeline failed:", err);
      process.exit(1);
    }
  });
}
