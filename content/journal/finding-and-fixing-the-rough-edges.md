---
title: "Finding and fixing the rough edges"
date: 2026-06-04
type: build-log
season: 2025-26
team: computer-vision
summary: "Fixing small image-scaling and model-output mismatches brought Jetson detections in line with our bench results."
tags: ["debugging", "jetson"]
legacyId: cv-3
---

Spent this stretch chasing down some inconsistencies between our Jetson results and our bench results. Turned out to be a couple of small mismatches in how the pipeline was handling image scaling and how it was reading the model’s output — nothing structural, just details that needed lining up.

Once those were sorted, detections on the Jetson started matching what we’d seen during development, and confidence levels across both classes look solid.

We’re treating this as a good sign that the core pipeline is close to flight-ready, and we’re shifting focus to making sure the whole system runs quickly enough in real time.

Next up: get the full pipeline running on our test rig and start timing each stage, not just detection on its own.
