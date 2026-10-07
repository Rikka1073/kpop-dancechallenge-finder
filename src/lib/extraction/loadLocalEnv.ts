import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function parseEnv(text: string): Record<string, string> {
  const values: Record<string, string> = {};

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const eq = line.indexOf("=");
    if (eq <= 0) {
      continue;
    }

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }

  return values;
}

function readEnvFile(filePath: string): Record<string, string> {
  if (!existsSync(filePath)) {
    return {};
  }
  return parseEnv(readFileSync(filePath, "utf8"));
}

export function loadLocalEnv(root = process.cwd()): void {
  const fromFiles = {
    ...readEnvFile(path.join(root, ".env")),
    ...readEnvFile(path.join(root, ".env.local")),
  };

  for (const [key, value] of Object.entries(fromFiles)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
