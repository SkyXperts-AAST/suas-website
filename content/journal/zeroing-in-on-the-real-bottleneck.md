---
title: "Zeroing in on the real bottleneck"
date: 2026-07-02
type: build-log
season: 2025-26
team: computer-vision
summary: "End-to-end timing showed that detection is performing well; the heavier confirmation stage is where most of our processing time is going."
tags: ["optimization", "pipeline"]
legacyId: cv-2
---

With the Jetson pipeline running smoothly, we finally timed the whole system end to end — and detection turned out not to be the slow part. The confirmation stage, which double-checks whether a detected region is really the mannequin, the tent, or just background clutter, is where most of our processing time is going.

Right now that stage relies on a heavier, general-purpose model, which is accurate but on the slower side for real-time use. We’re scoping out a lighter, purpose-built classifier to take its place, with an eye toward running it on the Jetson’s GPU alongside detection.

Good problem to have — it means the detector itself is performing well.

Next up: benchmark lighter classifier options and start looking at how it handles trickier real-world cases like partial occlusion.
