---
title: "Teaching the confirmation stage to handle occlusion"
date: 2026-07-24
type: build-log
season: 2025-26
team: computer-vision
summary: "We’re retraining the confirmation stage on realistic, partially covered target crops so it can handle the difficult cases the detector sees at flight altitude."
tags: ["dataset", "occlusion"]
legacyId: cv-1
---

With a lighter confirmation model in the works, we turned our attention to a common real-world headache: partially covered targets. A mannequin tucked under brush or a tent partly collapsed can still get flagged correctly by the detector, but the confirmation stage needs more practice recognizing these trickier cases.

We’re retraining the confirmation stage on crops that better reflect what the detector actually sees at flight altitude, with a stronger emphasis on partial-occlusion examples. Synthetic generation is proving especially useful here, since we can place targets under partial cover directly instead of waiting to find real-world examples of it.

Early signs are encouraging, and we’re feeling good about where the pipeline stands heading into our next round of outdoor testing.

Next up: fold these improvements into the full detector retrain and start planning our first full outdoor test of the complete search-to-confirmation loop.
