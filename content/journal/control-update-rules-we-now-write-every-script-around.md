---
title: "Control update: rules we now write every script around"
date: 2026-07-21
type: build-log
season: 2025-26
team: control
summary: "Retry loops on every critical call, clear_mission() before every upload, servo lock only after arm(). The list of rules we’d already paid for in debugging time."
tags: ["software", "process", "PX4"]
legacyId: ctrl-10
---

Past a certain point this season we stopped treating each new mission script as fresh code and started treating it as an application of rules we’d already paid for in debugging time. The list:

Every critical MAVSDK call (arming, takeoff, mission upload, servo actuation) goes through a retry loop now, 3 to 5 attempts a couple of seconds apart. Nothing critical is allowed to fail silently on the first try, because on real hardware the first try sometimes just doesn’t land.

clear_mission() runs before every single upload. Skip it and the drone hangs in Hold mode after takeoff. That one cost us more debugging time than it should have before we traced it back to a stale mission still sitting on the flight controller.

The payload-release servo gets locked into its safe position immediately after arm() returns, never before. PX4 resets actuator outputs to a disarmed position the instant it arms, so an earlier lock just gets overwritten.

We call RTL manually instead of letting PX4 handle return-to-launch on its own after the mission. That gives us control over how the return flight lines up with payload sequencing rather than leaving the timing to the autopilot.

On the hardware side, ModemManager was quietly interfering with USB serial communication to the flight controller, so it’s permanently disabled on the companion Pi. And mavsdk_server gets restarted fresh before every test run, since stale connection state carrying over between runs was a recurring source of flaky behaviour that took a while to diagnose each time.

Nothing on this list is clever. It’s the reason the mission script held up on competition day without any of these old failure modes showing up again.
