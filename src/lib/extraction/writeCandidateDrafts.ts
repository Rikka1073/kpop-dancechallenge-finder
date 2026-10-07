import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { CandidateDraftFile, assertCandidateDraftFile } from "./candidateDraft";

export function candidateDraftsPath(date: string, root = "data/raw"): string {
  return path.join(root, date, "candidate-drafts.json");
}

export async function writeCandidateDraftFile(
  file: CandidateDraftFile,
  date: string,
  root = "data/raw"
): Promise<string> {
  const payload = assertCandidateDraftFile(file);
  const filePath = candidateDraftsPath(date, root);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return filePath;
}
