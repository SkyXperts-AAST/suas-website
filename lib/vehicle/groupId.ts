export interface GroupId {
  subsystem: string;
  /** Only set when subsystem === "propulsion" — which of the 4 arms. */
  armIndex?: number;
}

export function groupIdKey(group: GroupId): string {
  return group.armIndex !== undefined
    ? `${group.subsystem}:${group.armIndex}`
    : group.subsystem;
}

export function groupIdsEqual(
  a?: GroupId | null,
  b?: GroupId | null
): boolean {
  const an = a ?? null;
  const bn = b ?? null;
  if (an === null || bn === null) return an === bn;
  return an.subsystem === bn.subsystem && an.armIndex === bn.armIndex;
}
