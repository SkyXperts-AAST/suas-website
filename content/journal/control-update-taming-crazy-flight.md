---
title: "Control update: taming \"crazy flight\""
date: 2026-05-04
type: build-log
season: 2025-26
team: control
summary: "An oscillation across roll, pitch and yaw left Storm unsafe to fly. We reworked the rate-controller gains by hand against the flight logs instead of re-running AutoTune."
tags: ["PX4", "analysis", "testing"]
legacyId: ctrl-5
---

Most of this update was one problem: an oscillation we’d nicknamed "Crazy Flight." The aircraft shook across roll, pitch and yaw badly enough that it wasn’t safely flyable. We could have re-run PX4’s AutoTune and hoped for a better result. Instead we went through the rate-controller gains by hand and checked them against what the flight logs were actually showing.

**Where we ended up**

- Roll rate: P 0.137, I 0.175, D 0.0015
- Pitch rate: P 0.136, I 0.175, D 0.0015
- Yaw rate: P 0.205, I 0.20, D 0.0034
- Angle gains: roll/pitch P at 6.5, yaw P at 4.67

Oscillation on all three axes dropped by roughly half compared to where we started.

What took the longest was working out why AutoTune’s first pass made things worse in places. Its D-term can amplify structural resonance in the airframe rather than damp it out. So we kept the P and I terms, which do reflect real airframe response, and re-checked the D terms by hand against vibration data instead of trusting them blind. We treat AutoTune as a starting point now, not an answer.
