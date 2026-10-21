---
title: "Control update: the bug that changed how we trigger payload release"
date: 2026-07-13
type: build-log
season: 2025-26
team: control
summary: "Mission-progress logs showed waypoints being skipped entirely. For a payload release gated on one waypoint event, that’s a release that might never fire."
tags: ["payload", "software", "incident"]
legacyId: ctrl-9
---

One specific bug, with an outsized effect on how our mission scripts are structured.

Early versions of the payload-release logic hung off a waypoint-reached event. The script waited for the mission to report it had reached a particular waypoint, then triggered the release. Reasonable enough. Then we went through the mission-progress logs and found waypoints being skipped: the mission would report jumping from waypoint 2 straight to waypoint 4, with no waypoint 3 event logged at all.

For most of a mission that’s harmless. For a payload release gated on one specific waypoint event, it’s a release that might never fire.

The trigger now fires unconditionally once the mission-progress loop finishes, with no dependence on any single waypoint event along the way. Small change in the code. We only found it because we read the logs closely after a flight that looked fine from the ground.
