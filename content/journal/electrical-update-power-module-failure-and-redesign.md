---
title: "Electrical Update: Power Module Failure and Redesign"
date: 2026-06-30
type: build-log
season: 2025-26
team: electrical
summary: "After a full mission-profile test flight, we noticed smoke coming from the PM07's buck regulator shortly after landing, while the battery was still connected."
tags: ["failure", "thermal", "power", "PM08-CAN", "architecture"]
legacyId: elec-3
---

June 2026

After a full mission-profile test flight, we noticed smoke coming from the PM07's buck regulator shortly after landing, while the battery was still connected. We disconnected the battery immediately. No other components on that rail were damaged.

Our working theory is thermal: the PM07 is rated for 90 A continuous with no forced airflow, and while hover current stays well within that rating, a full mission with real climbs and corrections is a more demanding duty cycle. We didn't have current logging in place at the time, so we can't confirm the exact current at failure.

Looking back, we'd already measured 246 A as our four-motor worst case back in May, and the PM07's 90 A rating was on record separately — but the two numbers were never compared directly until this failure.

We replaced the power distribution setup with a 300 A side-entry PDB for propulsion and a PM08-CAN (200 A continuous) for sensing, sized against the measured worst case rather than typical hover load. The PM08-CAN also reports over DroneCAN instead of analog sensing, giving us factory-calibrated telemetry and removing the scaling-constant issue from the earlier update.

After the swap, we confirmed voltage and current readings matched a handheld meter without calibration, and tested the full rail under simultaneous load on the bench before reintegration.

Final architecture: a single MAD 6S 28 Ah pack feeding the PM08-CAN (powering the Pixhawk 6C, telemetry radio, receiver, GPS, and release servo) and the 300 A PDB (powering the four ESCs, gimbal, and — via a buck converter — the Jetson Orin Nano). Avionics and propulsion remain on physically separate rails.

Next steps: reintegrate into the airframe and document the finalized rail assignments.
