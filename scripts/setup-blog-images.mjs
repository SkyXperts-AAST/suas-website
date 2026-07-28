import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "public", "blogs");
const ENTRIES_PATH = path.join(process.cwd(), "public", "build-log", "entries.json");

/** @type {Record<string, { hero: string; body?: string[] }>} */
const PHOTO_GUIDE = {
  "computer-vision/cv-1": {
    hero: "Storm in flight over the search grid during the lawnmower pattern at ~50 m AGL — wide shot showing the flight path or GCS screen with map overlay.",
    body: [
      "Same field session from ground level: aircraft on pattern, search boundary marked on the ground, or live detection overlay on the gimbal feed.",
    ],
  },
  "computer-vision/cv-2": {
    hero: "Training/evaluation setup — laptop with YOLO metrics, label-studio view, or sample detections on aerial imagery.",
    body: [
      "Real field captures used in the dataset — tarp targets, debris clutter, or side-by-side synthetic vs real frames.",
    ],
  },
  "computer-vision/cv-3": {
    hero: "SIYI A8 Mini gimbal camera mounted on the airframe or bench, cable routed toward the Jetson.",
    body: [
      "CV team bench session: A8 Mini feed on a monitor next to the Jetson, or close-up of the camera on the gimbal mount.",
    ],
  },
  "computer-vision/cv-4": {
    hero: "Small test platform (not Storm) on the bench or in a low hover — the cheap rig used before full-scale integration.",
  },
  "control/ctrl-1": {
    hero: "Storm during the full-mission field test — airborne on a waypoint leg or approaching the search area.",
    body: [
      "Outdoor flight during the mission dry run — hover, transit, or landing phase with field visible.",
    ],
  },
  "control/ctrl-2": {
    hero: "Control team at laptops running SITL/HITL — Gazebo window, mission logs, or Pixhawk on the bench wired for HITL.",
    body: [
      "Same session: split screen of simulation + real Pixhawk, or team reviewing SITL logs before HITL handoff.",
    ],
  },
  "control/ctrl-3": {
    hero: "Storm avionics bay with Pixhawk 6C, M9N GPS, and wiring visible — clean shot of the locked stack.",
    body: [
      "Close-up of the Pixhawk 6C installation, GPS module placement, or telemetry radio wiring in the bay.",
    ],
  },
  "control/ctrl-4": {
    hero: "Ground control station during the first PX4 + ROS 2 + QGC integration test — operator at laptop with QGroundControl open.",
    body: [
      "GCS view: QGroundControl showing vehicle state, mission upload screen, or MAVLink link status during the test.",
    ],
  },
  "electrical/elec-1": {
    hero: "GCS or laptop showing logged voltage/current telemetry from a flight — proof that power data is being recorded.",
    body: [
      "Same: telemetry plot, log review session, or printed pre-power-on checklist on the bench.",
    ],
  },
  "electrical/elec-2": {
    hero: "Power module bay during integration — harness work, PM08/PDB area, or team working on wiring with terminals visible.",
    body: [
      "Close-up of insulated terminals, heat-shrink on bus bars, or the integration workspace after the new handling rules.",
    ],
  },
  "electrical/elec-3": {
    hero: "Full power distribution layout — PM08-CAN, 300 A PDB, battery leads, and rail routing in the avionics bay.",
    body: [
      "Harness routing from PM08-CAN and PDB — labeled photo showing which rail goes where.",
    ],
  },
  "electrical/elec-4": {
    hero: "New PM08-CAN and 300 A side-entry PDB installed in Storm's avionics bay.",
    body: [
      "Close-up of the PM08-CAN and PDB mounting — part numbers readable if possible.",
    ],
  },
  "electrical/elec-5": {
    hero: "Storm in flight during the full mission profile test — the flight itself was fine; use an in-air shot from that day.",
    body: [
      "Post-flight on the ground: aircraft after landing, or the PM07 area (do not show active fire — a photo of the regulator/board area is enough).",
    ],
  },
  "electrical/elec-6": {
    hero: "Motor on thrust test stand at full throttle — clamp meter or power analyzer visible, or thrust-current plot screenshot.",
    body: [
      "Thrust vs current chart at the takeoff operating point, or bench photo with readout showing ~61.5 A per motor.",
    ],
  },
  "electrical/elec-7": {
    hero: "Thrust-current spline fit at cruise operating point (~1962 gf, ~10.12 A) — chart export or annotated plot.",
    body: [
      "Cruise operating point chart from the endurance model.",
      "Landing operating point chart (~1308 gf, ~5.87 A per motor).",
    ],
  },
  "electrical/elec-8": {
    hero: "Bench setup comparing PM07 reported current/voltage against a handheld multimeter or power analyzer.",
    body: [
      "Side-by-side: meter reading vs GCS/autopilot telemetry display showing the mismatch.",
    ],
  },
  "electrical/elec-9": {
    hero: "Battery pack (MAD 6S 28 Ah) on the bench with sizing notes, or cruise-point current chart used in sizing.",
    body: [
      "Cruise thrust-current curve used for average-draw calculations in the sizing spreadsheet.",
    ],
  },
  "electrical/elec-10": {
    hero: "Payload release mechanism on the bench — servo, trap door, or bracket latch with ESC in the loop.",
  },
  "electrical/elec-11": {
    hero: "Cross-sub-team meeting: electrical + software reviewing the avionics power budget spreadsheet.",
    body: [
      "Whiteboard or spreadsheet screenshot listing Pixhawk, GPS, radio, camera, Jetson current draws.",
    ],
  },
  "electrical/elec-12": {
    hero: "Early electrical team working through power system sizing — whiteboard with thrust-to-weight math or mass estimate.",
    body: [
      "Sizing session: AUW estimate, 2:1 T/W calculation, or motor thrust curve printouts on the table.",
    ],
  },
  "mechanical/mech-1": {
    hero: "Fully assembled Storm — hero shot of the complete airframe, folded or unfolded.",
    body: [
      "Storm on display: clean three-quarter view showing quad-X layout and folded footprint if possible.",
    ],
  },
  "mechanical/mech-2": {
    hero: "Failed landing gear after the 2 m drop test, or mechanical team inspecting the cracked part.",
    body: [
      "Inspecting the failed gear before redesign — crack or fracture visible.",
    ],
  },
  "mechanical/mech-3": {
    hero: "Sandwich composite frame plates and carbon fiber arms on Storm — material/construction detail.",
    body: [
      "Close-up of composite plate layup, CNC-finished edge, or mockup next to production part.",
    ],
  },
  "mechanical/mech-4": {
    hero: "Payload release mechanisms — trap door and water-bottle bracket, or drop-test impact markers on the ground.",
    body: [
      "Drop test day: impact points marked on the field, or both release mechanisms mounted on the airframe.",
    ],
  },
  "mechanical/mech-5": {
    hero: "Motor and prop candidates on the thrust test stand — three motors or two props side by side for comparison.",
    body: [
      "Thrust-current curves from the motor/prop trade study — annotated chart showing why Avenger + 15558 won.",
    ],
  },
};

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapLine(text, maxLen = 72) {
  const words = text.split(" ");
  const lines = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxLen && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function placeholderSvg({ label, hint, filename }) {
  const hintLines = wrapLine(hint, 68);
  const lineHeight = 28;
  const hintStartY = 560 - Math.floor((hintLines.length * lineHeight) / 2);

  const hintText = hintLines
    .map(
      (line, index) =>
        `<tspan x="800" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000" role="img" aria-label="${escapeXml(hint)}">
  <rect width="1600" height="1000" fill="#0a1628"/>
  <rect x="48" y="48" width="1504" height="904" fill="#111f35" stroke="#ffffff26" stroke-width="2" stroke-dasharray="14 10" rx="12"/>
  <text x="800" y="180" fill="#f5f5f7" font-family="ui-sans-serif, system-ui, sans-serif" font-size="34" font-weight="700" text-anchor="middle">Photo placeholder</text>
  <text x="800" y="240" fill="#e31c1c" font-family="ui-monospace, monospace" font-size="22" text-anchor="middle">${escapeXml(filename)}</text>
  <text x="800" y="320" fill="#ffffff99" font-family="ui-sans-serif, system-ui, sans-serif" font-size="20" font-weight="600" text-anchor="middle">${escapeXml(label)}</text>
  <text x="800" y="${hintStartY}" fill="#ffffffcc" font-family="ui-sans-serif, system-ui, sans-serif" font-size="22" text-anchor="middle">${hintText}</text>
  <text x="800" y="920" fill="#ffffff66" font-family="ui-sans-serif, system-ui, sans-serif" font-size="18" text-anchor="middle">Replace with a .jpg or .webp and update entries.json if the extension changes</text>
</svg>
`;
}

function writePlaceholder(dir, filename, label, hint) {
  const filePath = path.join(dir, filename);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    filePath,
    placeholderSvg({ label, hint, filename }),
    "utf-8",
  );
  return `/blogs/${path.relative(ROOT, filePath).split(path.sep).join("/")}`;
}

const data = JSON.parse(fs.readFileSync(ENTRIES_PATH, "utf-8"));
const guideLines = [
  "# Build log photo guide",
  "",
  "Each entry has its own folder under `public/blogs/{team}/{entry-id}/`.",
  "",
  "Placeholders are SVG files for now. When you have real photos:",
  "",
  "1. Drop `hero.jpg` (or `.webp`) into the entry folder.",
  "2. Drop `body-1.jpg`, `body-2.jpg`, etc. for inline article images.",
  "3. Update paths in `public/build-log/entries.json` if you change the file extension.",
  "",
  "Recommended aspect ratio: **16:10** (matches the build log layout). Minimum width ~1200px.",
  "",
  "---",
  "",
];

for (const [team, entries] of Object.entries(data)) {
  guideLines.push(`## ${team}`, "");

  for (const entry of entries) {
    const folderKey = `${team}/${entry.id}`;
    const guide = PHOTO_GUIDE[folderKey];
    if (!guide) {
      throw new Error(`Missing photo guide for ${folderKey}`);
    }

    const dir = path.join(ROOT, team, entry.id);
    fs.mkdirSync(dir, { recursive: true });

    const heroPath = writePlaceholder(
      dir,
      "hero.svg",
      `${entry.id} — hero`,
      guide.hero,
    );
    entry.image = heroPath;
    // Keep existing imageAlt — it describes the intended photo for accessibility.

    let bodyIndex = 0;
    for (const block of entry.body ?? []) {
      if (block.type !== "image") continue;

      bodyIndex += 1;
      const hint =
        guide.body?.[bodyIndex - 1] ??
        block.caption ??
        block.alt ??
        guide.hero;
      const bodyPath = writePlaceholder(
        dir,
        `body-${bodyIndex}.svg`,
        `${entry.id} — body ${bodyIndex}`,
        hint,
      );
      block.src = bodyPath;
    }

    guideLines.push(`### ${entry.id} — ${entry.title}`, "");
    guideLines.push(`- **Folder:** \`public/blogs/${folderKey}/\``);
    guideLines.push(`- **Hero (\`hero.svg\`):** ${guide.hero}`);
    if (guide.body?.length) {
      guide.body.forEach((hint, index) => {
        guideLines.push(`- **Body ${index + 1} (\`body-${index + 1}.svg\`):** ${hint}`);
      });
    }
    guideLines.push("");
  }
}

fs.writeFileSync(ENTRIES_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
fs.writeFileSync(path.join(ROOT, "PHOTO-GUIDE.md"), `${guideLines.join("\n")}\n`, "utf-8");

console.log("Created blog image folders and updated entries.json");
