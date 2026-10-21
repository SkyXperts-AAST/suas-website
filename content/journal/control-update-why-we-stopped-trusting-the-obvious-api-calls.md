---
title: "Control update: why we stopped trusting the \"obvious\" API calls"
date: 2026-07-06
type: build-log
season: 2025-26
team: control
summary: "Three MAVSDK calls that look right in the documentation and fail on real hardware — and what we replaced each of them with."
tags: ["software", "integration", "process"]
legacyId: ctrl-8
---

Writing autonomous mission scripts for our companion computer taught us the same lesson several times over this season. The MAVSDK call that looks correct in the documentation is not always the one that works on real hardware. Three we tried, watched fail in flight, and dropped:

set_takeoff_altitude() went first. It’s the documented way to set a takeoff height and it’s known to be unreliable on real hardware. We set MIS_TAKEOFF_ALT directly through the parameter system instead, and that’s been solid ever since.

set_current_mission_item() went second. On paper it lets a script jump to a specific mission item on demand. On our hardware it timed out reliably, so we cut it rather than wrap retry logic around something that doesn’t work.

The third was a pattern rather than a function: waiting on altitude with a fixed asyncio.sleep(). A flat sleep can’t account for real variance in climb rate. Sometimes the aircraft is there early, sometimes late, and the fixed wait either burns time or moves on before the aircraft has arrived. Every altitude wait now polls against a tolerance band and only proceeds once the aircraft is actually where it needs to be.

These aren’t exotic bugs. They surface after you’ve flown the same script enough times on real hardware to see the pattern, which is also why they’re easy to relearn the hard way next season if nobody writes them down.
