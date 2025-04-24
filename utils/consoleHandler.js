import readline from "readline";

export function handleConsoleInput(callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.setPrompt("Enter input: ");
  rl.prompt();

  rl.on("line", (line) => {
    callback(line);
    rl.prompt();
  });

  rl.on("close", () => {
    console.log("Exiting...");
    process.exit(0);
  });
}
