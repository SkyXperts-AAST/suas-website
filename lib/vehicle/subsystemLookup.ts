import subsystemMap from "@/models/subsystem-map.json";

export interface SubsystemInfo {
  key: string;
  label: string;
}

/**
 * Minimal structural view of a scene-graph node. Declared instead of importing
 * THREE.Object3D so this module stays a plain data helper, usable from the
 * model-inspection scripts as well as from the renderer.
 */
export interface NamedNode {
  name: string;
  parent?: NamedNode | null;
}

// GLTFLoader rewrites node names on load, and the order matters:
//   1. PropertyBinding.sanitizeNodeName replaces WHITESPACE with "_", then
//      strips reserved chars [ ] . : /
//      -> "Motor Mount.001" becomes "Motor_Mount001"
//   2. createUniqueName appends "_1", "_2", ... to disambiguate names that
//      collide after step 1 -> "Motor_Mount001_4"
// The whitespace step is easy to miss and silently breaks every group name
// containing a space ("Motor Mount", "bldc motor", "SIYI Camera v1", ...),
// which is nearly all of them. Both sides of every comparison go through this,
// so lookups survive the load.
//
// The trailing "_\d+$" strip only removes createUniqueName's suffix. It cannot
// eat a real name ending in a digit ("Camera M1 v2" -> "Camera_M1_v2"), because
// it requires an underscore immediately before the digits.
function normalizeName(name: string): string {
  return name
    .replace(/\s/g, "_")
    .replace(/[[\].:/]/g, "")
    .replace(/_\d+$/, "");
}

const groupToSubsystem = new Map<string, SubsystemInfo>();
for (const [key, def] of Object.entries(subsystemMap.subsystems)) {
  for (const group of def.groups) {
    groupToSubsystem.set(normalizeName(group), { key, label: def.label });
  }
}

// Value is unused; a Map keeps this usable with matchWithSuffixes.
const propellerGroups = new Map<string, true>(
  subsystemMap.propellerGroups.map((g) => [normalizeName(g), true])
);

// Verified per-node overrides for parts with no assembly group of their own.
// See the `explicitNodeNames` note in subsystem-map.json.
const explicitNodeNames = new Map<string, SubsystemInfo>();
for (const [nodeName, entry] of Object.entries(
  subsystemMap.explicitNodeNames.nodes
)) {
  const def =
    subsystemMap.subsystems[
      entry.subsystem as keyof typeof subsystemMap.subsystems
    ];
  if (def) {
    explicitNodeNames.set(normalizeName(nodeName), {
      key: entry.subsystem,
      label: def.label,
    });
  }
}

// Leaf-name tables for the previous, flattened production model, which has no
// assembly groups to match on. See the `legacy` note in subsystem-map.json for
// why these are still consulted.
const legacyPropellerNames = new Set(
  subsystemMap.legacy.propellerNodeNames.map(normalizeName)
);

const legacyNodeNames = new Map<string, SubsystemInfo>();
for (const [nodeName, key] of Object.entries(
  subsystemMap.legacy.nodeNameToSubsystem
)) {
  const def = subsystemMap.subsystems[key as keyof typeof subsystemMap.subsystems];
  if (def) legacyNodeNames.set(normalizeName(nodeName), { key, label: def.label });
}

/**
 * Resolves one name against a table of GROUP names, tolerating the
 * duplicate/instance suffixes Blender and GLTFLoader append. Tries the whole
 * name first, then strips one trailing digit at a time.
 *
 * Exact-match-first is load-bearing: "Component733" is a real group name, and
 * stripping digits eagerly would truncate it to "Component7"/"Component" and
 * collide with the payload's "Component1".."Component6".
 *
 * Only safe for the curated group tables, whose keys are human-authored CAD
 * assembly names. Never use it on auto-generated leaf names — see the legacy
 * branch of lookupSubsystemForNode.
 */
function matchWithSuffixes<T>(name: string, table: Map<string, T>): T | undefined {
  let candidate = normalizeName(name);
  while (candidate.length > 0) {
    const hit = table.get(candidate);
    if (hit) return hit;
    if (!/\d$/.test(candidate)) return undefined;
    candidate = candidate.slice(0, -1);
  }
  return undefined;
}

/** Matches a single name against the assembly-group table. */
export function lookupSubsystemByGroup(name: string): SubsystemInfo | undefined {
  return matchWithSuffixes(name, groupToSubsystem);
}

/**
 * Resolves the subsystem owning `node` by walking up its ancestor chain and
 * taking the NEAREST matching assembly group. Walking inward-out is what makes
 * nested groups work: "Board_Frame" resolves to companionComputer on its own,
 * and a bare "Mount Bracket" resolves via its "Motor Mount" ancestor.
 *
 * Resolution order:
 *   1. Verified per-node overrides, for parts with no group of their own.
 *   2. Nearest matching assembly group.
 *   3. The previous model's leaf-name table, which keeps the currently
 *      deployed (flattened, group-less) GLB working. Last so it can never
 *      override either of the above.
 */
export function lookupSubsystemForNode(
  node: NamedNode | null | undefined
): SubsystemInfo | undefined {
  for (let current = node; current; current = current.parent ?? null) {
    // Exact match: override keys are auto-generated leaf names, so the
    // digit-stripping used for group names would mis-resolve them.
    const hit = explicitNodeNames.get(normalizeName(current.name));
    if (hit) return hit;
  }
  for (let current = node; current; current = current.parent ?? null) {
    const hit = lookupSubsystemByGroup(current.name);
    if (hit) return hit;
  }
  for (let current = node; current; current = current.parent ?? null) {
    // Exact match only. Legacy keys are auto-generated leaf names ("Body1.113"
    // -> "Body1113"), so digit-stripping would walk them straight into an
    // unrelated shorter key ("Body11") and mis-tag the part.
    const hit = legacyNodeNames.get(normalizeName(current.name));
    if (hit) return hit;
  }
  return undefined;
}

/**
 * True if `node` sits under a spinning-propeller group. Falls back to the
 * previous model's propeller leaf names (exact match only, for the same reason
 * as the legacy subsystem table) so the deployed model keeps spinning until
 * the new GLB is swapped in.
 */
export function isPropellerNode(node: NamedNode | null | undefined): boolean {
  for (let current = node; current; current = current.parent ?? null) {
    if (matchWithSuffixes(current.name, propellerGroups)) return true;
  }
  for (let current = node; current; current = current.parent ?? null) {
    if (legacyPropellerNames.has(normalizeName(current.name))) return true;
  }
  return false;
}

export function subsystemLabel(key: string): string {
  const entry = Object.entries(subsystemMap.subsystems).find(([k]) => k === key);
  return entry?.[1].label ?? key;
}
