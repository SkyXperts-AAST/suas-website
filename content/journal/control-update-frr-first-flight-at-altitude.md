---
title: "Control update: FRR, first flight at altitude"
date: 2026-06-15
type: build-log
season: 2025-26
team: control
summary: "A full dry run of the ICMTC mission plan, then FRR at meaningfully higher altitude than anything we’d tested at. Altitude tracking came in at 0.13 m RMSE."
tags: ["field-test", "validation"]
legacyId: ctrl-7
---

Before FRR we ran a full dry run of the ICMTC competition mission plan, the same 9-waypoint route with the mid-mission payload drop we’d be flying later in the season. It ran clean, so we went into FRR fairly confident the mission logic wasn’t the risk. The unknown was altitude: meaningfully higher than anything we’d tested at.

Altitude doesn’t change the margin for error equally on every axis, so we didn’t scale everything up together. Takeoff altitude and horizontal cruise speed went up, because altitude and open air buy you room to react to a horizontal deviation. Vertical ascent and descent rates came down, because misjudging altitude up there is far less recoverable than drifting sideways. We also redid barometer and gyro calibration and tightened the actuator PWM range before the flight.

**Before → After**

- Takeoff altitude: 10 m → 17.98 m
- Landing-approach altitude: 10 m → 20 m
- Final landing-phase altitude: 5 m → 7 m
- Cruise speed: 3 m/s → 5 m/s
- Auto ascent rate: 3 m/s → 1.6 m/s
- Auto descent rate: 1.5 m/s → 1.0 m/s

The flight reached 45.41 m, held a steady ~16 m cruise for most of the mission, and landed safely. Altitude tracking came in at 0.13 m RMSE, about as tight as anything we’d flown lower down. That was the answer we wanted: the gains generalized past the conditions we tuned them in.
