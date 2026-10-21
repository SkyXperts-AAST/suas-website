---
title: "Electrical Update: Wiring Incident and Process Changes"
date: 2026-07-31
type: build-log
season: 2025-26
team: electrical
summary: "During reintegration of the new power module, a positive and negative terminal made contact and caused a short."
tags: ["incident", "safety", "process"]
legacyId: elec-4
---

July 2026

During reintegration of the new power module, a positive and negative terminal made contact and caused a short. The battery stopped holding charge afterward, reading close to zero volts, and was taken out of service.

This happened during routine reintegration work, not during anything unusual, which is generally when this kind of incident happens.

As a result, we made several changes to our wiring process: exposed terminals and bus bars are now insulated with heat-shrink or tape before any integration work begins, connections are made one polarity at a time wherever possible, and polarity is checked with a multimeter on any new or modified harness before it's connected. We also wrote down and rehearsed a battery disconnect procedure for the team.

More broadly, we're now logging voltage and current on every flight, since the lack of logging made it hard to diagnose the June regulator failure. Components are sized against measured worst-case draw rather than typical draw, with that number recorded alongside the part selection. And any servo or actuator system gets bench-tested with its real power path (ESC included) before flight, a lesson from earlier payload testing that's held up throughout the season.

Next steps: fly the timed endurance test that's been pending since March, now that telemetry is reliable enough to trust the result.
