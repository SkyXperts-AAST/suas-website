---
title: "Locking in our detection approach"
date: 2026-03-16
type: build-log
season: 2025-26
team: computer-vision
summary: "We settled on one YOLO model for both target classes and a synthetic-data pipeline that produces correctly scaled, automatically labelled training images."
tags: ["detection", "dataset"]
legacyId: cv-5
---

This week we settled on our core detection strategy: a single YOLO model trained to recognize both the mannequin and the tent, rather than running two separate models. With everything else competing for compute onboard, one model handling both classes made the most sense for keeping things fast and simple.

To get there, we’re leaning heavily on synthetic data generation. Using SDXL inpainting, we’re placing targets into realistic pasture backgrounds matched to the Search Boundary terrain out at Skyway Range, Tulsa, with mask sizing tied to our camera’s ground sample distance so targets show up at the right scale for a given altitude. Because we control the placement, labels come out accurate automatically, which saves us a ton of manual annotation work down the line.

Early test renders are looking good, and we’re excited to start scaling this up into a full training set.

Next up: build out a larger batch of synthetic images and start looking at what it takes to get this running fast on the Jetson.
