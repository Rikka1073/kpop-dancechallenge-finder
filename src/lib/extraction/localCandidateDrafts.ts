import { readdir, readFile } from "node:fs/promises";
import { CandidateDraftBundle, CandidateDraftFile, assertCandidateDraftFile } from "./candidateDraft";
import { candidateDraftsPath, writeCandidateDraftFile } from "./writeCandidateDrafts";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function assertDraftDate(value: string): string {
  if (!DATE_PATTERN.test(value)) {
    throw new Error("日付は YYYY-MM-DD です");
  }
  return value;
}

export async function listCandidateDraftDates(root = "data/raw"): Promise<string[]> {
  try {
    const entries = await readdir(root, { withFileTypes: true });
    const dates = await Promise.all(
      entries
        .filter((entry) => entry.isDirectory() && DATE_PATTERN.test(entry.name))
        .map(async (entry) => {
          try {
            await readFile(candidateDraftsPath(entry.name, root), "utf8");
            return entry.name;
          } catch {
            return null;
          }
        })
    );

    return dates
      .filter((date): date is string => Boolean(date))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

export async function readCandidateDraftFile(date: string, root = "data/raw"): Promise<CandidateDraftFile> {
  const filePath = candidateDraftsPath(assertDraftDate(date), root);
  const text = await readFile(filePath, "utf8");
  try {
    return assertCandidateDraftFile(JSON.parse(text));
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("JSON として読めません");
    }
    throw error;
  }
}

export async function loadCandidateDraftBundle(date?: string, root = "data/raw"): Promise<CandidateDraftBundle> {
  const dates = await listCandidateDraftDates(root);
  if (dates.length === 0) {
    throw new Error(
      "data/raw に candidate-drafts.json がありません。先に npm run extract:candidates を実行してください"
    );
  }

  const selected = date ? assertDraftDate(date) : dates[0];
  if (!dates.includes(selected)) {
    throw new Error(`${selected} の candidate-drafts.json がありません`);
  }

  return {
    dates,
    date: selected,
    path: candidateDraftsPath(selected, root),
    draft: await readCandidateDraftFile(selected, root),
  };
}

export async function saveCandidateDraftFile(
  date: string,
  file: CandidateDraftFile,
  root = "data/raw"
): Promise<CandidateDraftBundle> {
  await writeCandidateDraftFile(file, assertDraftDate(date), root);
  return loadCandidateDraftBundle(date, root);
}
