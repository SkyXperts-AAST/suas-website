---
title: "Control update: ICMTC 2026, 3rd place and best mission performance"
date: 2026-07-21
type: build-log
season: 2025-26
team: control
summary: "3rd overall and best mission performance at ICMTC 2026. Mission 1 flew 1.72 km across 9 waypoints with a mid-mission payload drop at 0.12 m altitude RMSE."
tags: ["field-test", "SUAS 2026", "payload"]
legacyId: ctrl-11
---

We placed 3rd overall at ICMTC 2026 and took best mission performance. Mission 1 is the flight worth writing about.

It was a single-lap, 9-waypoint autonomous route with a mid-mission payload drop, flown on the same rate-controller gains from earlier in the season and the script stack described above.

**Mission 1**

- Duration: 538.2 s
- Distance flown: 1.72 km
- Max altitude: 46.99 m
- Altitude tracking: 0.12 m RMSE, the tightest we saw all season
- Waypoint accuracy: ~7.5 m average error, well inside the competition’s 30 m tolerance
- Landed safely

Because if there’s one thing this flight proved, it’s that the controller isn’t the bottleneck anymore. 0.12 m of altitude tracking under real competition conditions is about as tight as it gets.
