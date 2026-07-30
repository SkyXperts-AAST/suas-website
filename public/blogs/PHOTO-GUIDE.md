# Build log photo guide

Each entry has its own folder under `public/blogs/{team}/{entry-id}/`.

Placeholders are SVG files for now. When you have real photos:

1. Drop `hero.jpg` (or `.webp`) into the entry folder.
2. Drop `body-1.jpg`, `body-2.jpg`, etc. for inline article images.
3. Update paths in `public/build-log/entries.json` if you change the file extension.

Recommended aspect ratio: **16:10** (matches the build log layout). Minimum width ~1200px.

---

## computer-vision

### cv-1 — Field day: lawnmower search + live geolocation

- **Folder:** `public/blogs/computer-vision/cv-1/`
- **Hero (`hero.svg`):** Storm in flight over the search grid during the lawnmower pattern at ~50 m AGL — wide shot showing the flight path or GCS screen with map overlay.
- **Body 1 (`body-1.svg`):** Same field session from ground level: aircraft on pattern, search boundary marked on the ground, or live detection overlay on the gimbal feed.

### cv-2 — Training run: YOLO detector on synthetic + real data

- **Folder:** `public/blogs/computer-vision/cv-2/`
- **Hero (`hero.svg`):** Training/evaluation setup — laptop with YOLO metrics, label-studio view, or sample detections on aerial imagery.
- **Body 1 (`body-1.svg`):** Real field captures used in the dataset — tarp targets, debris clutter, or side-by-side synthetic vs real frames.

### cv-3 — Camera decision: A8 Mini for mapping + detection

- **Folder:** `public/blogs/computer-vision/cv-3/`
- **Hero (`hero.svg`):** SIYI A8 Mini gimbal camera mounted on the airframe or bench, cable routed toward the Jetson.
- **Body 1 (`body-1.svg`):** CV team bench session: A8 Mini feed on a monitor next to the Jetson, or close-up of the camera on the gimbal mount.

### cv-4 — Shaking out the vision scripts on the small test rig first

- **Folder:** `public/blogs/computer-vision/cv-4/`
- **Hero (`hero.svg`):** Small test platform (not Storm) on the bench or in a low hover — the cheap rig used before full-scale integration.

## control

### ctrl-5 — Control update: taming "crazy flight"

- **Folder:** `public/blogs/control/ctrl-5/`
- **Hero (`hero.svg`):** Storm during rate-controller gain tuning and vibration testing.

### ctrl-6 — Control update: first clean mission

- **Folder:** `public/blogs/control/ctrl-6/`
- **Hero (`hero.svg`):** Storm flying an autonomous three-waypoint test mission.

### ctrl-7 — Control update: FRR, first flight at altitude

- **Folder:** `public/blogs/control/ctrl-7/`
- **Hero (`hero.svg`):** Storm during the Flight Readiness Review flight at altitude.

### ctrl-8 — Control update: why we stopped trusting the "obvious" API calls

- **Folder:** `public/blogs/control/ctrl-8/`
- **Hero (`hero.svg`):** Companion computer running autonomous mission scripts on the bench.

### ctrl-9 — Control update: the bug that changed how we trigger payload release

- **Folder:** `public/blogs/control/ctrl-9/`
- **Hero (`hero.svg`):** Payload release mechanism mounted under Storm.

### ctrl-10 — Control update: rules we now write every script around

- **Folder:** `public/blogs/control/ctrl-10/`
- **Hero (`hero.svg`):** Control team reviewing mission script behaviour before a test run.

### ctrl-11 — Control update: ICMTC 2026, 3rd place and best mission performance

- **Folder:** `public/blogs/control/ctrl-11/`
- **Hero (`hero.svg`):** Storm flying its competition mission at ICMTC 2026.

## electrical

### elec-1 — Electrical Update: Power System Sizing (September 2025 – January 2026)

- **Folder:** `public/blogs/electrical/elec-1/`
- **Hero (`hero.svg`):** Early electrical team working through power system sizing — whiteboard with thrust-to-weight math, mass estimate, or the avionics power budget spreadsheet.
- **Body 1 (`body-1.svg`):** Battery pack (MAD 6S 28 Ah) on the bench with sizing notes, or the payload release mechanism bench test with the ESC in the loop.

### elec-2 — Electrical Update: Telemetry Calibration and Endurance Testing (February – May 2026)

- **Folder:** `public/blogs/electrical/elec-2/`
- **Hero (`hero.svg`):** Bench setup comparing PM07 reported current/voltage against a handheld multimeter or power analyzer.
- **Body 1 (`body-1.svg`):** Motor on thrust test stand at full throttle — clamp meter or power analyzer visible, or a thrust-current plot showing ~61.5 A per motor at the takeoff operating point.

### elec-3 — Electrical Update: Power Module Failure and Redesign (June 2026)

- **Folder:** `public/blogs/electrical/elec-3/`
- **Hero (`hero.svg`):** Storm in flight during the full mission profile test — the flight itself was fine; use an in-air shot from that day, or the PM07 area post-flight (do not show active fire — a photo of the regulator/board area is enough).
- **Body 1 (`body-1.svg`):** New PM08-CAN and 300 A side-entry PDB installed in Storm's avionics bay — part numbers readable if possible.

### elec-4 — Electrical Update: Wiring Incident and Process Changes (July 2026)

- **Folder:** `public/blogs/electrical/elec-4/`
- **Hero (`hero.svg`):** Power module bay during re-integration — harness work, PM08/PDB area, or team working on wiring with terminals visible.
- **Body 1 (`body-1.svg`):** Close-up of insulated terminals, heat-shrink on bus bars, or the integration workspace after the new handling rules.

## mechanical

### mech-6 — Concept & Requirements

- No image.

### mech-7 — CAD Takes Shape

- **Folder:** `public/blogs/mechanical/mech-cad/`
- **Body 1 (`body-1.png`):** CAD assembly render of the shifted-X quadcopter in SolidWorks.

### mech-8 — Structural Verification

- **Folder:** `public/blogs/mechanical/mech-fea/`
- **Body 1 (`body-1.jpg`):** FEA von-Mises stress plot of the frame under thrust and payload loading.

### mech-9 — Manufacturing Begins

- No image.

### mech-10 — Flight Testing

- **Folder:** `public/blogs/mechanical/mech-flight/`
- **Body 1 (`body-1.jpg`):** Storm in flight during the first flight-test campaign.

### mech-11 — Final Validation

- **Folder:** `public/blogs/mechanical/mech-validation/`
- **Body 1 (`body-1.jpg`):** Storm on the ground after a final validation flight test.

