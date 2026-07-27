/**
 * Per-subsystem copy for the vehicle InfoPanel.
 *
 * Every subsystem declares the same shape — a spec grid plus a one-line
 * tagline — and the panel lays out against that shape, so filling in or
 * revising copy is a data edit with no layout work.
 *
 * A subsystem that is really an enclosure for several distinct parts declares
 * `components` instead of its own `specs`. The panel renders those as a
 * single-open accordion, each entry carrying its own grid and tagline.
 * `avionicsHousing` is the only one today.
 *
 * Spec labels are sentence case on purpose ("KV rating", not "KV RATING"): the
 * panel styles them as muted small text rather than shouting them in caps, so
 * the monospace values stay the thing your eye lands on.
 */

export interface SubsystemSpec {
  label: string;
  value: string;
}

/** One entry in an accordion-style subsystem. */
export interface SubsystemComponent {
  /** Stable key, also used for the aria-controls/panel id pair. */
  id: string;
  /** Component name, shown collapsed and expanded. */
  name: string;
  /** One-line role, shown next to the name while collapsed. */
  summary: string;
  specs: SubsystemSpec[];
  tagline: string;
}

export interface SubsystemContent {
  /** One-line positioning statement under the title. */
  summary: string;
  specs: SubsystemSpec[];
  /** Single-line rationale, set below the spec grid. */
  tagline: string;
  /** When present, the panel renders these as an accordion instead of `specs`. */
  components?: SubsystemComponent[];
}

/** Stand-in for a spec value we haven't filled in yet. */
const TBD = "—";

const PLACEHOLDER_TAGLINE =
  "Selection rationale for this subsystem is being written up.";

const CONTENT: Record<string, SubsystemContent> = {
  avionicsHousing: {
    summary: "Protects and mounts the flight controller stack.",
    // Rendered as an accordion — the housing itself has no headline figures,
    // the three boards inside it do.
    specs: [],
    tagline: "",
    components: [
      {
        id: "pixhawk-6c",
        name: "Pixhawk 6C",
        summary: "Flight controller",
        specs: [
          { label: "Processor", value: "STM32H743, Cortex-M7 @ 480MHz" },
          { label: "IMUs", value: "ICM-42688-P + BMI055 (redundant)" },
          {
            label: "Design",
            value: "Vibration-isolated, temp-controlled sensor board",
          },
        ],
        tagline:
          "Redundant sensing for autonomous flight with zero in-air recovery margin.",
      },
      {
        id: "m9n-gps",
        name: "M9N GPS",
        summary: "Positioning",
        specs: [
          { label: "Module", value: "Holybro M9N (Ublox)" },
          {
            label: "GNSS",
            value: "4-constellation concurrent (GPS/Galileo/GLONASS/BeiDou)",
          },
          { label: "Sensitivity", value: "-167dBm" },
          { label: "Cold start", value: "26s" },
        ],
        tagline: "Reliable position fixes over cluttered search terrain.",
      },
      {
        id: "er8-receiver",
        name: "ER8 Receiver",
        summary: "RC link",
        specs: [
          { label: "System", value: "RadioMaster ER8, ExpressLRS" },
          { label: "Channels", value: "8 PWM" },
          { label: "Antenna", value: "Dual, 20cm high-sensitivity" },
          { label: "Telemetry", value: "100mW, voltage sensing" },
        ],
        tagline: "Long-range, low-latency control link.",
      },
    ],
  },
  battery: {
    summary: "Primary energy store for propulsion and avionics.",
    specs: [
      { label: "Model", value: "MAD 6S 28Ah solid-state lithium" },
      { label: "Voltage", value: "22.2V nominal (25.8V–16.2V range)" },
      { label: "Capacity", value: "622Wh" },
      { label: "Energy density", value: "up to 305Wh/kg" },
      { label: "Discharge", value: "50–175A continuous" },
    ],
    tagline: "Maximum energy density within the 35lb weight ceiling.",
  },
  motor: {
    summary: "Brushless outrunner driving one propulsion arm. Four fitted.",
    specs: [
      { label: "Model", value: "BrotherHobby Avenger 4215 V5" },
      { label: "KV rating", value: "390/435/555 (variant)" },
      { label: "Cells", value: "6–8S" },
      { label: "Weight", value: "213g each" },
      { label: "Thrust", value: "up to 7.9kg" },
      { label: "Construction", value: "Al-7075 casing, N52H magnets" },
    ],
    tagline:
      "Thrust-to-weight tuned for four-arm efficiency over redundant lift.",
  },
  esc: {
    summary:
      "Commutates the motors from the flight controller's demand. One per motor.",
    specs: [
      { label: "Model", value: "Hobbywing Skywalker 80A V2 UBEC" },
      { label: "Current", value: "80A continuous / 100A burst" },
      { label: "BEC", value: "5V/7A switch-mode" },
      { label: "Processor", value: "32-bit ARM M0 @ 96MHz" },
    ],
    tagline:
      "Isolated per-motor control for field diagnostics and redundancy.",
  },
  companionComputer: {
    summary: "Runs autonomy, vision, and the ground link off-board of the FC.",
    specs: [
      { label: "Model", value: "NVIDIA Jetson Orin Nano Super" },
      { label: "AI performance", value: "67 TOPS INT8" },
      { label: "GPU", value: "1024-core Ampere, 32 tensor cores" },
      { label: "CPU", value: "6-core Cortex-A78AE @ 1.7GHz" },
      { label: "Memory", value: "8GB LPDDR5, 102GB/s" },
      { label: "Power", value: "7–25W" },
    ],
    tagline: "Onboard vision inference, no dependency on external systems.",
  },
  camera: {
    summary: "Imaging sensor for target detection and classification.",
    specs: [
      { label: "Model", value: "SIYI A8 Mini" },
      { label: "Video", value: "4K UHD" },
      { label: "Sensor", value: '8MP 1/1.7" Sony CMOS' },
      { label: "Gimbal", value: "270° yaw, 3-axis stabilized" },
      { label: "Zoom", value: "6x digital" },
      { label: "Protocol", value: "PX4/ArduPilot MAVLink native" },
    ],
    tagline:
      "Stabilized feed for mapping and target confirmation, same hardware.",
  },
  // Not specced yet — deliberately left on placeholders.
  payload: {
    summary: "Carries and releases the competition delivery load.",
    specs: [
      { label: "Type", value: TBD },
      { label: "Capacity", value: TBD },
      { label: "Release", value: TBD },
      { label: "Actuator", value: TBD },
      { label: "Mass", value: TBD },
    ],
    tagline: PLACEHOLDER_TAGLINE,
  },
};

/** Falls back to an empty-but-valid shape so an untagged key can't break the panel. */
export function subsystemContent(key: string): SubsystemContent {
  return (
    CONTENT[key] ?? {
      summary: "",
      specs: [],
      tagline: PLACEHOLDER_TAGLINE,
    }
  );
}
