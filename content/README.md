# Site content

Everything on the site that changes from season to season lives in this folder.
You never need to touch the code to add a post, a person, a vehicle, or a season.
After editing, run `npm run dev` and check the page, then commit and push. The
site rebuilds and deploys automatically from `main`.

```
content/
  people.yml          every person who has been part of SkyXperts, ever
  sponsors.yml        every sponsor, ever
  seasons/<id>.yml    one file per season (e.g. 2026-27.yml)
  fleet/<slug>.yml    one file per vehicle or side project
  journal/<slug>.md   one file per post (build log, story, recap, tutorial)
```

## Add a journal post

Create `content/journal/my-post-title.md`. The file name becomes the URL
(`/journal/my-post-title`).

```markdown
---
title: "What we learned from our first night flight"
date: 2026-11-02
type: story            # build-log | story | recap | tutorial | announcement
season: 2026-27
team: control          # optional, a sub-team id from the season file
authors: [fares-fathy] # optional, ids from people.yml
summary: "One or two sentences shown on cards and in link previews."
cover: "/journal/night-flight/cover.jpg"   # optional, image under public/
coverAlt: "Storm hovering at dusk"
tags: ["night ops", "SUAS 2027"]
---

Normal Markdown goes here. Paragraphs, **bold**, lists, links, and images:

![Alt text](/journal/night-flight/photo-1.jpg "Optional caption")
```

Put the images for a post in `public/journal/<post-slug>/`.

## Add a person

Add an entry to `people.yml`. `id` is lowercase-with-dashes and must be unique.
The person then appears wherever a season file references their id.

## Start a new season

1. Copy the current season file, e.g. `seasons/2026-27.yml` to `seasons/2027-28.yml`.
2. Set `current: true` in the new file and `current: false` in the old one.
3. Update leadership, mentors, structure, members and sponsors for the new year.

The old season stays on the Legacy page automatically, with its roster,
results, vehicles and posts. Anyone listed in an older season but not the
current one shows up as an alumnus. Mentors listed in the current season are
shown as active mentors on the Team page.

## Add a vehicle

Create `content/fleet/<slug>.yml` (copy `storm.yml` as a template). `status` is
`active`, `development` or `retired`; `kind` is `multirotor`, `vtol`,
`fixed-wing`, `ugv` or `project`.
