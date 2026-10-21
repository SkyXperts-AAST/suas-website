---
title: "Getting the model onto the Jetson"
date: 2026-04-18
type: build-log
season: 2025-26
team: computer-vision
summary: "We exported the YOLO model through TensorRT conversion so onboard inference can take advantage of the Jetson’s GPU."
tags: ["hardware", "jetson"]
legacyId: cv-4
---

This week was all about getting our YOLO model ready to run onboard. We exported the model and worked it through TensorRT conversion so it can take advantage of the Jetson’s GPU instead of relying on slower CPU inference.

There were a few hiccups along the way getting the converted model to behave the same way it did on our development machines, but nothing that pointed to a problem with the model itself — just the usual friction of getting a pipeline to run the same way on new hardware.

We’re optimistic about where this is headed and are looking forward to timing the full pipeline once everything is stable on-device.

Next up: finish smoothing out on-device performance and start timing the complete detection pipeline end to end.
