---
title: "Electrical Update: Power System Sizing"
date: 2026-01-31
type: build-log
season: 2025-26
team: electrical
summary: "This period, the electrical team focused on sizing the power system based on mechanical's estimated all-up weight of just under 7 kg with payload."
tags: ["propulsion", "sizing", "power-budget", "battery"]
legacyId: elec-1
---

September 2025 – January 2026

This period, the electrical team focused on sizing the power system based on mechanical's estimated all-up weight of just under 7 kg with payload. We used a 2:1 thrust-to-weight ratio as our design floor, giving the aircraft enough margin to correct for gusts and hold altitude rather than just hover. At that weight, this comes out to roughly 14 kgf of total thrust, about 3.5 kgf per motor.

We also put together a power budget for the avionics stack — Pixhawk 6C, Holybro M9N GPS, RFD900A telemetry, RadioMaster ER8 receiver, SIYI A8 Mini, and Jetson Orin Nano — coming to about 35 W total. This rail is kept separate from the propulsion rail, since a voltage dip on the avionics side can reset the flight controller mid-flight.

During payload release testing, we ran 50 bench trials and got 47 clean releases. The 3 failures turned out to be a test setup issue: the servo was being bench-tested without an ESC in the loop, and it draws its power through the ESC's BEC rather than an independent rail. Once we added the ESC back into the test setup, all 3 released cleanly.

For the battery, we sized capacity based on average current draw over mission duration with a 20% margin added for wind, aggressive maneuvering, and cold-weather capacity loss. We also checked the pack's C-rating against peak current during a full-throttle climb, since a pack that's fine for average draw can still sag badly under peak load. We landed on a MAD 6S 28 Ah solid-state pack, rated for 140 A continuous and 280 A max.

Next steps: hand off thrust requirements to the propulsion trade study and begin motor thrust/current testing on the bench.
