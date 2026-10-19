const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const out = fs.openSync(path.join(root, "next-3009.log"), "a");
const err = fs.openSync(path.join(root, "next-3009.err.log"), "a");
const nextBin = require.resolve("next/dist/bin/next");

const child = spawn(process.execPath, [nextBin, "start", "--port", "3009"], {
  cwd: root,
  env: { ...process.env, NODE_ENV: "production" },
  stdio: ["ignore", out, err],
  windowsHide: true,
});

child.on("exit", (code, signal) => {
  fs.appendFileSync(
    path.join(root, "next-3009.err.log"),
    `\nnext start exited with code ${code ?? "null"} signal ${signal ?? "null"}\n`,
  );
  process.exit(code ?? 1);
});

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));

setInterval(() => {}, 2 ** 30);
