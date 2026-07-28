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

### ctrl-1 — Full mission dry run + failsafe trials

- **Folder:** `public/blogs/control/ctrl-1/`
- **Hero (`hero.svg`):** Storm during the full-mission field test — airborne on a waypoint leg or approaching the search area.
- **Body 1 (`body-1.svg`):** Outdoor flight during the mission dry run — hover, transit, or landing phase with field visible.

### ctrl-2 — SITL first, then HITL, before anything flies

- **Folder:** `public/blogs/control/ctrl-2/`
- **Hero (`hero.svg`):** Control team at laptops running SITL/HITL — Gazebo window, mission logs, or Pixhawk on the bench wired for HITL.
- **Body 1 (`body-1.svg`):** Same session: split screen of simulation + real Pixhawk, or team reviewing SITL logs before HITL handoff.

### ctrl-3 — Locking the autonomy stack and failsafe timers

- **Folder:** `public/blogs/control/ctrl-3/`
- **Hero (`hero.svg`):** Storm avionics bay with Pixhawk 6C, M9N GPS, and wiring visible — clean shot of the locked stack.
- **Body 1 (`body-1.svg`):** Close-up of the Pixhawk 6C installation, GPS module placement, or telemetry radio wiring in the bay.

### ctrl-4 — Wiring PX4, ROS 2, and QGC into one pipeline

- **Folder:** `public/blogs/control/ctrl-4/`
- **Hero (`hero.svg`):** Ground control station during the first PX4 + ROS 2 + QGC integration test — operator at laptop with QGroundControl open.
- **Body 1 (`body-1.svg`):** GCS view: QGroundControl showing vehicle state, mission upload screen, or MAVLink link status during the test.

## electrical

### elec-1 — Two kinds of failure, one checklist

- **Folder:** `public/blogs/electrical/elec-1/`
- **Hero (`hero.svg`):** GCS or laptop showing logged voltage/current telemetry from a flight — proof that power data is being recorded.
- **Body 1 (`body-1.svg`):** Same: telemetry plot, log review session, or printed pre-power-on checklist on the bench.

### elec-2 — Shorted a pack during re-integration

- **Folder:** `public/blogs/electrical/elec-2/`
- **Hero (`hero.svg`):** Power module bay during integration — harness work, PM08/PDB area, or team working on wiring with terminals visible.
- **Body 1 (`body-1.svg`):** Close-up of insulated terminals, heat-shrink on bus bars, or the integration workspace after the new handling rules.

### elec-3 — Power architecture locked: one battery, two regulated rails

- **Folder:** `public/blogs/electrical/elec-3/`
- **Hero (`hero.svg`):** Full power distribution layout — PM08-CAN, 300 A PDB, battery leads, and rail routing in the avionics bay.
- **Body 1 (`body-1.svg`):** Harness routing from PM08-CAN and PDB — labeled photo showing which rail goes where.

### elec-4 — New distribution hardware: 300 A PDB and a digital power module

- **Folder:** `public/blogs/electrical/elec-4/`
- **Hero (`hero.svg`):** New PM08-CAN and 300 A side-entry PDB installed in Storm's avionics bay.
- **Body 1 (`body-1.svg`):** Close-up of the PM08-CAN and PDB mounting — part numbers readable if possible.

### elec-5 — Smoke off the buck regulator after our first full mission

- **Folder:** `public/blogs/electrical/elec-5/`
- **Hero (`hero.svg`):** Storm in flight during the full mission profile test — the flight itself was fine; use an in-air shot from that day.
- **Body 1 (`body-1.svg`):** Post-flight on the ground: aircraft after landing, or the PM07 area (do not show active fire — a photo of the regulator/board area is enough).

### elec-6 — Bench test: pushing the motors to full throttle to size the ESCs

- **Folder:** `public/blogs/electrical/elec-6/`
- **Hero (`hero.svg`):** Motor on thrust test stand at full throttle — clamp meter or power analyzer visible, or thrust-current plot screenshot.
- **Body 1 (`body-1.svg`):** Thrust vs current chart at the takeoff operating point, or bench photo with readout showing ~61.5 A per motor.

### elec-7 — Endurance math: 29.93 minutes, on paper

- **Folder:** `public/blogs/electrical/elec-7/`
- **Hero (`hero.svg`):** Thrust-current spline fit at cruise operating point (~1962 gf, ~10.12 A) — chart export or annotated plot.
- **Body 1 (`body-1.svg`):** Cruise operating point chart from the endurance model.
- **Body 2 (`body-2.svg`):** Landing operating point chart (~1308 gf, ~5.87 A per motor).

### elec-8 — The PM07's readings didn't match the meter

- **Folder:** `public/blogs/electrical/elec-8/`
- **Hero (`hero.svg`):** Bench setup comparing PM07 reported current/voltage against a handheld multimeter or power analyzer.
- **Body 1 (`body-1.svg`):** Side-by-side: meter reading vs GCS/autopilot telemetry display showing the mismatch.

### elec-9 — Sizing the pack, then checking the part that actually bites

- **Folder:** `public/blogs/electrical/elec-9/`
- **Hero (`hero.svg`):** Battery pack (MAD 6S 28 Ah) on the bench with sizing notes, or cruise-point current chart used in sizing.
- **Body 1 (`body-1.svg`):** Cruise thrust-current curve used for average-draw calculations in the sizing spreadsheet.

### elec-10 — Chasing down payload release failures that weren't real

- **Folder:** `public/blogs/electrical/elec-10/`
- **Hero (`hero.svg`):** Payload release mechanism on the bench — servo, trap door, or bracket latch with ESC in the loop.

### elec-11 — Budgeting the small rail: what the avionics actually pull

- **Folder:** `public/blogs/electrical/elec-11/`
- **Hero (`hero.svg`):** Cross-sub-team meeting: electrical + software reviewing the avionics power budget spreadsheet.
- **Body 1 (`body-1.svg`):** Whiteboard or spreadsheet screenshot listing Pixhawk, GPS, radio, camera, Jetson current draws.

### elec-12 — The power system starts with a number we didn't pick

- **Folder:** `public/blogs/electrical/elec-12/`
- **Hero (`hero.svg`):** Early electrical team working through power system sizing — whiteboard with thrust-to-weight math or mass estimate.
- **Body 1 (`body-1.svg`):** Sizing session: AUW estimate, 2:1 T/W calculation, or motor thrust curve printouts on the table.

## mechanical

### mech-1 — Storm is airframe-complete

- **Folder:** `public/blogs/mechanical/mech-1/`
- **Hero (`hero.svg`):** Fully assembled Storm — hero shot of the complete airframe, folded or unfolded.
- **Body 1 (`body-1.svg`):** Storm on display: clean three-quarter view showing quad-X layout and folded footprint if possible.

### mech-2 — Landing gear failed the drop test — here's what we changed

- **Folder:** `public/blogs/mechanical/mech-2/`
- **Hero (`hero.svg`):** Failed landing gear after the 2 m drop test, or mechanical team inspecting the cracked part.
- **Body 1 (`body-1.svg`):** Inspecting the failed gear before redesign — crack or fracture visible.

### mech-3 — Locking the frame material and mass budget

- **Folder:** `public/blogs/mechanical/mech-3/`
- **Hero (`hero.svg`):** Sandwich composite frame plates and carbon fiber arms on Storm — material/construction detail.
- **Body 1 (`body-1.svg`):** Close-up of composite plate layup, CNC-finished edge, or mockup next to production part.

### mech-4 — Two release mechanisms, one drop test day

- **Folder:** `public/blogs/mechanical/mech-4/`
- **Hero (`hero.svg`):** Payload release mechanisms — trap door and water-bottle bracket, or drop-test impact markers on the ground.
- **Body 1 (`body-1.svg`):** Drop test day: impact points marked on the field, or both release mechanisms mounted on the airframe.

### mech-5 — Motor and prop trade study — three options down to one

- **Folder:** `public/blogs/mechanical/mech-5/`
- **Hero (`hero.svg`):** Motor and prop candidates on the thrust test stand — three motors or two props side by side for comparison.
- **Body 1 (`body-1.svg`):** Thrust-current curves from the motor/prop trade study — annotated chart showing why Avenger + 15558 won.

