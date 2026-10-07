import { extractCandidateDrafts } from "../src/lib/extraction/extractCandidateDrafts";
import { listReviewUrls } from "../src/lib/extraction/candidateDraft";
import { loadLocalEnv } from "../src/lib/extraction/loadLocalEnv";
import { writeCandidateDraftFile } from "../src/lib/extraction/writeCandidateDrafts";

loadLocalEnv();

function readArg(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag);
  if (index === -1) {
    return undefined;
  }
  return argv[index + 1];
}

function readRepeatableArg(argv: string[], flag: string): string[] {
  const values: string[] = [];
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === flag && argv[index + 1]) {
      values.push(argv[index + 1]);
    }
  }
  return values;
}

async function main() {
  const argv = process.argv.slice(2);
  const issue = readArg(argv, "--issue");
  const date = readArg(argv, "--date") || new Date().toISOString().slice(0, 10);
  const groups = [
    ...readRepeatableArg(argv, "--group"),
    ...(readArg(argv, "--groups") || "")
      .split(",")
      .map((group) => group.trim())
      .filter(Boolean),
  ];

  if (!issue || groups.length === 0) {
    console.error("Usage: npm run extract:candidates -- --issue MAS-19 --group IVE --date 2026-10-06");
    process.exit(1);
  }

  const file = await extractCandidateDrafts({
    groups,
    linearIssue: issue,
  });
  const draftPath = await writeCandidateDraftFile(file, date);
  const urls = listReviewUrls(file);

  console.log(
    JSON.stringify(
      {
        path: draftPath,
        count: file.candidates.length,
        urls,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
