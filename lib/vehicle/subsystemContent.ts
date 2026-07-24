/**
 * Per-subsystem copy for the vehicle InfoPanel.
 *
 * The values are placeholders — the real numbers and write-ups aren't in yet.
 * The *shape* is the point: every subsystem declares the same spec-row slots
 * and a rationale paragraph, and the panel lays out against that shape, so
 * filling in real copy later is a data edit with no layout work.
 *
 * To fill one in: replace the `value` strings and the `rationale` text. Row
 * count can vary per subsystem without breaking the layout.
 */

export interface SubsystemSpec {
  label: string;
  value: string;
}

export interface SubsystemContent {
  /** One-line positioning statement under the title. */
  summary: string;
  specs: SubsystemSpec[];
  /** Why this part was chosen — the engineering argument, 2-4 sentences. */
  rationale: string;
}

/** Stand-in for a spec value we haven't filled in yet. */
const TBD = "—";

const PLACEHOLDER_RATIONALE =
  "Selection rationale for this subsystem is being written up. It will cover the requirement it had to meet, the alternatives we bench-tested against it, and the trade-off we accepted to get there.";

const CONTENT: Record<string, SubsystemContent> = {
  avionicsHousing: {
    summary: "Protects and mounts the flight controller stack.",
    specs: [
      { label: "Material", value: TBD },
      { label: "Process", value: TBD },
      { label: "Mass", value: TBD },
      { label: "Mounting", value: TBD },
      { label: "Ingress", value: TBD },
    ],
    rationale: PLACEHOLDER_RATIONALE,
  },
  battery: {
    summary: "Primary energy store for propulsion and avionics.",
    specs: [
      { label: "Chemistry", value: TBD },
      { label: "Capacity", value: TBD },
      { label: "Configuration", value: TBD },
      { label: "Nominal Voltage", value: TBD },
      { label: "Mass", value: TBD },
    ],
    rationale: PLACEHOLDER_RATIONALE,
  },
  motor: {
    summary: "Brushless outrunner driving one propulsion arm.",
    specs: [
      { label: "Model", value: TBD },
      { label: "KV", value: TBD },
      { label: "Max Thrust", value: TBD },
      { label: "Propeller", value: TBD },
      { label: "Mass", value: TBD },
    ],
    rationale: PLACEHOLDER_RATIONALE,
  },
  esc: {
    summary: "Commutates the motors from the flight controller's demand.",
    specs: [
      { label: "Model", value: TBD },
      { label: "Continuous", value: TBD },
      { label: "Burst", value: TBD },
      { label: "Protocol", value: TBD },
      { label: "Firmware", value: TBD },
    ],
    rationale: PLACEHOLDER_RATIONALE,
  },
  companionComputer: {
    summary: "Runs autonomy, vision, and the ground link off-board of the FC.",
    specs: [
      { label: "Model", value: TBD },
      { label: "Compute", value: TBD },
      { label: "Memory", value: TBD },
      { label: "OS", value: TBD },
      { label: "FC Link", value: TBD },
    ],
    rationale: PLACEHOLDER_RATIONALE,
  },
  camera: {
    summary: "Imaging sensor for target detection and classification.",
    specs: [
      { label: "Model", value: TBD },
      { label: "Sensor", value: TBD },
      { label: "Resolution", value: TBD },
      { label: "Field of View", value: TBD },
      { label: "Interface", value: TBD },
    ],
    rationale: PLACEHOLDER_RATIONALE,
  },
  payload: {
    summary: "Carries and releases the competition delivery load.",
    specs: [
      { label: "Type", value: TBD },
      { label: "Capacity", value: TBD },
      { label: "Release", value: TBD },
      { label: "Actuator", value: TBD },
      { label: "Mass", value: TBD },
    ],
    rationale: PLACEHOLDER_RATIONALE,
  },
};

/** Falls back to an empty-but-valid shape so an untagged key can't break the panel. */
export function subsystemContent(key: string): SubsystemContent {
  return (
    CONTENT[key] ?? {
      summary: "",
      specs: [],
      rationale: PLACEHOLDER_RATIONALE,
    }
  );
}
