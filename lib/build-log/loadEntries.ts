import { readFile } from "fs/promises";
import path from "path";
import { isSubTeamSlug } from "./teams";
import type { BuildLogEntriesFile, BuildLogEntry, SubTeamSlug } from "./types";

const ENTRIES_PATH = path.join(
  process.cwd(),
  "public",
  "build-log",
  "entries.json",
);

function sortEntries(entries: BuildLogEntry[]): BuildLogEntry[] {
  return [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

function validateEntriesFile(data: unknown): BuildLogEntriesFile {
  if (!data || typeof data !== "object") {
    throw new Error("build-log/entries.json must be a JSON object.");
  }

  const result = {} as BuildLogEntriesFile;

  for (const [slug, entries] of Object.entries(data)) {
    if (!isSubTeamSlug(slug)) {
      continue;
    }

    if (!Array.isArray(entries)) {
      throw new Error(`build-log/entries.json["${slug}"] must be an array.`);
    }

    result[slug] = entries as BuildLogEntry[];
  }

  return result;
}

export async function loadBuildLogEntries(): Promise<BuildLogEntriesFile> {
  const raw = await readFile(ENTRIES_PATH, "utf-8");
  return validateEntriesFile(JSON.parse(raw));
}

export async function getEntriesForTeam(
  slug: SubTeamSlug,
): Promise<BuildLogEntry[]> {
  const entries = await loadBuildLogEntries();
  return sortEntries(entries[slug] ?? []);
}
