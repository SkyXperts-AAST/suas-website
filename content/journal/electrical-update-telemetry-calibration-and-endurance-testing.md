---
title: "Electrical Update: Telemetry Calibration and Endurance Testing"
date: 2026-05-31
type: build-log
season: 2025-26
team: electrical
summary: "This period, we ran into an issue with our power module. The PM07 was reporting pack voltage and current that disagreed with a handheld meter."
tags: ["telemetry", "PM07", "endurance", "ESC", "bench-test"]
legacyId: elec-2
---

February – May 2026

This period, we ran into an issue with our power module. The PM07 was reporting pack voltage and current that disagreed with a handheld meter. This module uses analog sensing with scaling constants that ship as generic defaults and need to be calibrated against a real meter — something we hadn't done yet, and the readings were especially unreliable at low current, right where our avionics rail sits.

This mattered because the low-battery failsafe is calculated from that current reading, so an inaccurate number meant our return-to-launch trigger point wasn't where we designed it to be. We started investigating whether to move to a module with factory-calibrated digital telemetry instead of maintaining our own calibration.

We also built an endurance model using our avionics power budget (35.4 W, ~1.59 A at 22.2 V) combined with per-motor current at takeoff, cruise, and landing, budgeting 80% of the pack's rated capacity as usable. This gave us an estimated flight time of around 30 minutes — a bench-derived estimate we still needed to confirm in flight.

To get a real number for the ESCs, we bench-tested each Avenger 4215 V5 motor to full throttle and measured 61.5 A per motor at the takeoff operating point. We paired these with Hobbywing Skywalker 80 A V2 ESCs, giving about 30% current headroom above the measured worst case, and sized our wiring (10 AWG battery leads, 8 AWG PM08-CAN leads) against the full four-motor worst case of 246 A.

Next steps: test sustained full-throttle operation over a longer duration, and fly a timed endurance test to check against our 30-minute estimate.
