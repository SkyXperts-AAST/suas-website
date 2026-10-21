/**
 * Loads everything under /content at build time. Server-only (uses fs), so
 * import it from server components and pages, and pass plain data down to
 * client components.
 *
 * Every loader validates what it reads and throws with the file name and the
 * problem, so a typo in a YAML file fails the build loudly instead of silently
 * dropping someone from the site.
 */
import fs from "fs";
import path from "path";
import { load as loadYaml } from "js-yaml";
import matter from "gray-matter";
import { marked } from "marked";
import type {
  Competition,
  Department,
  FleetKind,
  FleetStatus,
  Person,
  Post,
  PostSummary,
  PostType,
  Season,
  SeasonRole,
  Sponsor,
  Vehicle,
} from "./types";

export * from "./types";

const ROOT = path.join(process.cwd(), "content");

function fail(file: string, message: string): never {
  throw new Error(`content/${file}: ${message}`);
}

function readYaml<T>(rel: string): T {
  const raw = fs.readFileSync(path.join(ROOT, rel), "utf-8");
  try {
    return loadYaml(raw) as T;
  } catch (error) {
    fail(rel, `invalid YAML. ${(error as Error).message}`);
  }
}

function listFiles(dir: string, ext: string): string[] {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((name) => name.endsWith(ext))
    .sort();
}

function str(value: unknown): string {
  return value === undefined || value === null ? "" : String(value);
}

function strList(value: unknown): string[] {
  return Array.isArray(value) ? value.map(str).filter(Boolean) : [];
}

/* ------------------------------------------------------------------ people */

let peopleCache: Map<string, Person> | null = null;

export function getPeople(): Map<string, Person> {
  if (peopleCache) return peopleCache;
  const rows = readYaml<unknown[]>("people.yml") ?? [];
  const map = new Map<string, Person>();
  for (const row of rows as Record<string, unknown>[]) {
    const id = str(row.id);
    if (!id) fail("people.yml", "an entry is missing `id`.");
    if (!row.name) fail("people.yml", `"${id}" is missing \`name\`.`);
    if (map.has(id)) fail("people.yml", `duplicate id "${id}".`);
    map.set(id, {
      id,
      name: str(row.name),
      photo: row.photo ? str(row.photo) : undefined,
      linkedin: row.linkedin ? str(row.linkedin) : undefined,
    });
  }
  peopleCache = map;
  return map;
}

function person(id: string, file: string): Person {
  const found = getPeople().get(id);
  if (!found) fail(file, `unknown person "${id}". Add them to people.yml first.`);
  return found;
}

/* ---------------------------------------------------------------- sponsors */

let sponsorCache: Map<string, Sponsor> | null = null;

export function getSponsors(): Map<string, Sponsor> {
  if (sponsorCache) return sponsorCache;
  const rows = readYaml<Record<string, unknown>[]>("sponsors.yml") ?? [];
  const map = new Map<string, Sponsor>();
  for (const row of rows) {
    const id = str(row.id);
    if (!id) fail("sponsors.yml", "an entry is missing `id`.");
    map.set(id, {
      id,
      name: str(row.name),
      logo: row.logo ? str(row.logo) : undefined,
      url: row.url ? str(row.url) : undefined,
    });
  }
  sponsorCache = map;
  return map;
}

/* ----------------------------------------------------------------- seasons */

let seasonCache: Season[] | null = null;

/** All seasons, newest first. */
export function getSeasons(): Season[] {
  if (seasonCache) return seasonCache;
  const seasons = listFiles("seasons", ".yml").map((name) => {
    const file = `seasons/${name}`;
    const raw = readYaml<Record<string, unknown>>(file);
    const id = str(raw.id);
    if (id !== name.replace(/\.yml$/, "")) {
      fail(file, `\`id\` must match the file name ("${name.replace(/\.yml$/, "")}").`);
    }

    const leadership: SeasonRole[] = (
      (raw.leadership as Record<string, unknown>[]) ?? []
    ).map((row) => ({ person: person(str(row.person), file), role: str(row.role) }));

    const structure: Department[] = (
      (raw.structure as Record<string, unknown>[]) ?? []
    ).map((dept) => ({
      id: str(dept.id),
      name: str(dept.name),
      summary: dept.summary ? str(dept.summary) : undefined,
      lead: dept.lead ? person(str(dept.lead), file) : undefined,
      teams: ((dept.teams as Record<string, unknown>[]) ?? []).map((team) => ({
        id: str(team.id),
        name: str(team.name),
        summary: team.summary ? str(team.summary) : undefined,
        lead: team.lead ? person(str(team.lead), file) : undefined,
        members: strList(team.members).map((pid) => person(pid, file)),
      })),
    }));

    const competitions: Competition[] = (
      (raw.competitions as Record<string, unknown>[]) ?? []
    ).map((row) => ({
      name: str(row.name),
      edition: str(row.edition),
      vehicle: row.vehicle ? str(row.vehicle) : undefined,
      results: strList(row.results),
    }));

    const sponsors = strList(raw.sponsors).map((sid) => {
      const found = getSponsors().get(sid);
      if (!found) fail(file, `unknown sponsor "${sid}". Add it to sponsors.yml first.`);
      return found;
    });

    const recruitment = raw.recruitment as Record<string, unknown> | undefined;

    return {
      id,
      label: str(raw.label) || id,
      current: raw.current === true,
      title: str(raw.title),
      summary: str(raw.summary),
      milestones: ((raw.milestones as Record<string, unknown>[]) ?? []).map((m) => ({
        date: str(m.date),
        title: str(m.title),
        detail: m.detail ? str(m.detail) : undefined,
      })),
      competitions,
      vehicles: strList(raw.vehicles),
      sponsors,
      leadership,
      mentors: strList(raw.mentors).map((pid) => person(pid, file)),
      structure,
      recruitment: recruitment
        ? { open: recruitment.open === true, note: str(recruitment.note), url: recruitment.url ? str(recruitment.url) : undefined }
        : undefined,
    } satisfies Season;
  });

  seasons.sort((a, b) => b.id.localeCompare(a.id));
  const currents = seasons.filter((s) => s.current);
  if (currents.length !== 1) {
    throw new Error(
      `content/seasons: exactly one season must have \`current: true\` (found ${currents.length}).`,
    );
  }
  seasonCache = seasons;
  return seasons;
}

export function getCurrentSeason(): Season {
  return getSeasons().find((s) => s.current)!;
}

export function getSeason(id: string): Season | undefined {
  return getSeasons().find((s) => s.id === id);
}

/** Every person in a season: leadership, mentors and sub-team members. */
export function peopleInSeason(season: Season): Set<string> {
  const ids = new Set<string>();
  season.leadership.forEach((r) => ids.add(r.person.id));
  season.mentors.forEach((p) => ids.add(p.id));
  season.structure.forEach((d) => {
    if (d.lead) ids.add(d.lead.id);
    d.teams.forEach((t) => {
      if (t.lead) ids.add(t.lead.id);
      t.members.forEach((p) => ids.add(p.id));
    });
  });
  return ids;
}

/** Sub-team names by id, newest season winning, for labelling posts. */
export function getTeamNames(): Map<string, string> {
  const names = new Map<string, string>();
  for (const season of [...getSeasons()].reverse()) {
    for (const dept of season.structure) {
      names.set(dept.id, dept.name);
      for (const team of dept.teams) names.set(team.id, team.name);
    }
  }
  return names;
}

/* ------------------------------------------------------------------- fleet */

const KINDS: FleetKind[] = ["multirotor", "vtol", "fixed-wing", "ugv", "project"];
const STATUSES: FleetStatus[] = ["active", "development", "retired"];

let fleetCache: Vehicle[] | null = null;

export function getFleet(): Vehicle[] {
  if (fleetCache) return fleetCache;
  const vehicles = listFiles("fleet", ".yml").map((name) => {
    const file = `fleet/${name}`;
    const raw = readYaml<Record<string, unknown>>(file);
    const slug = str(raw.slug);
    if (slug !== name.replace(/\.yml$/, "")) fail(file, "`slug` must match the file name.");
    const kind = str(raw.kind) as FleetKind;
    const status = str(raw.status) as FleetStatus;
    if (!KINDS.includes(kind)) fail(file, `\`kind\` must be one of ${KINDS.join(", ")}.`);
    if (!STATUSES.includes(status)) fail(file, `\`status\` must be one of ${STATUSES.join(", ")}.`);
    return {
      slug,
      name: str(raw.name),
      kind,
      status,
      seasons: strList(raw.seasons),
      tagline: str(raw.tagline),
      summary: str(raw.summary),
      image: raw.image ? str(raw.image) : undefined,
      photo: raw.photo ? str(raw.photo) : undefined,
      specs: ((raw.specs as Record<string, unknown>[]) ?? []).map((s) => ({
        label: str(s.label),
        value: str(s.value),
      })),
      achievements: strList(raw.achievements),
    } satisfies Vehicle;
  });
  const order = (v: Vehicle) => STATUSES.indexOf(v.status);
  vehicles.sort(
    (a, b) =>
      order(a) - order(b) ||
      (b.seasons[0] ?? "").localeCompare(a.seasons[0] ?? ""),
  );
  fleetCache = vehicles;
  return vehicles;
}

export function getVehicle(slug: string): Vehicle | undefined {
  return getFleet().find((v) => v.slug === slug);
}

/* ----------------------------------------------------------------- journal */

const POST_TYPES: PostType[] = ["build-log", "story", "recap", "tutorial", "announcement"];

let postCache: Post[] | null = null;

/** All posts, newest first. */
export function getPosts(): Post[] {
  if (postCache) return postCache;
  const teamNames = getTeamNames();
  const posts = listFiles("journal", ".md").map((name) => {
    const file = `journal/${name}`;
    const { data, content } = matter(fs.readFileSync(path.join(ROOT, file), "utf-8"));
    const type = str(data.type) as PostType;
    if (!data.title) fail(file, "missing `title`.");
    if (!data.date) fail(file, "missing `date` (YYYY-MM-DD).");
    if (!POST_TYPES.includes(type)) fail(file, `\`type\` must be one of ${POST_TYPES.join(", ")}.`);
    const date =
      data.date instanceof Date ? data.date.toISOString().slice(0, 10) : str(data.date);
    const team = data.team ? str(data.team) : undefined;
    const words = content.split(/\s+/).filter(Boolean).length;
    return {
      slug: name.replace(/\.md$/, ""),
      title: str(data.title),
      date,
      type,
      season: str(data.season),
      team,
      teamName: team ? teamNames.get(team) ?? team : undefined,
      authors: strList(data.authors).map((pid) => person(pid, file)),
      summary: str(data.summary),
      cover: data.cover ? str(data.cover) : undefined,
      coverAlt: data.coverAlt ? str(data.coverAlt) : undefined,
      tags: strList(data.tags),
      readingMinutes: Math.max(1, Math.round(words / 220)),
      html: marked.parse(content, { async: false }) as string,
    } satisfies Post;
  });
  posts.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
  postCache = posts;
  return posts;
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

/** Posts without their rendered body, for cards and client components. */
export function toSummary(post: Post): PostSummary {
  const { html, ...rest } = post;
  void html;
  return rest;
}
