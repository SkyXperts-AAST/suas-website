import subsystemMap from "@/models/subsystem-map.json";

export interface SubsystemInfo {
  key: string;
  label: string;
}

// The CAD node names in subsystem-map.json (e.g. "Body1.005") are NOT the names
// three.js exposes at runtime. GLTFLoader rewrites them on load:
//   1. THREE.PropertyBinding.sanitizeNodeName strips reserved chars [ ] . : /
//      -> "Body1.005" becomes "Body1005"
//   2. GLTFLoader.createUniqueName appends "_1", "_2", ... to disambiguate names
//      that collide after step 1 (this GLB names meshes and nodes identically,
//      so collisions are common) -> "Body1005_4"
// We normalize both the map keys and the incoming runtime name the same way so
// lookups survive the transformation. Verified collision-free: all map keys
// normalize to distinct keys with no cross-subsystem overlap.
function normalizeName(name: string): string {
  return name.replace(/[[\].:/]/g, "").replace(/_\d+$/, "");
}

const nodeNameToSubsystem = new Map<string, SubsystemInfo>();

for (const [key, def] of Object.entries(subsystemMap.subsystems)) {
  for (const nodeName of def.nodeNames) {
    nodeNameToSubsystem.set(normalizeName(nodeName), { key, label: def.label });
  }
}

export function lookupSubsystem(nodeName: string): SubsystemInfo | undefined {
  return nodeNameToSubsystem.get(normalizeName(nodeName));
}

export function subsystemLabel(key: string): string {
  const entry = Object.entries(subsystemMap.subsystems).find(
    ([k]) => k === key
  );
  return entry?.[1].label ?? key;
}
