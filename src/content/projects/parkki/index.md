---
title: Parkki
subtitle: Tampere parking map
tagline: A live map of every parking area in Tampere, coloured by what parking costs for the time you stay.
tags: [Web, Open data, Live]
card: featured
order: 2
stack: [TypeScript, React, MapLibre GL, Vite, vitest, GitHub Actions, Cloudflare Pages]
accent: "#7b4bd6"
why: "I wanted one map that answers where I can park, for how long and for how much, without reading every sign on the street."
backdrop: ./01-desktop.png
diagram:
  inputs:
    - "City of Tampere open geodata (WFS)"
    - "Garage operators' price pages"
    - "Street-sweeping layer"
  core:
    - "Daily data pipeline (GitHub Actions)"
    - "Compact JSON"
    - "Rules engine: holidays, disc and paid hours, limits, winter bans, sweeping"
  outputs:
    - "Static map app (React + MapLibre)"
    - "Cloudflare Pages, data served to the page only"
    - "SEO landing pages and deep links"
history:
  - { date: "2026-10-29", rev: "A", change: "Rules, data pipeline, garage prices and the map page." }
  - { date: "2026-10-29", rev: "B", change: "Published on Cloudflare Pages with a daily data refresh and security headers." }
  - { date: "2026-10-29", rev: "C", change: "Review fixes: verdicts for drivers without permits, data files served to the page only, sign-coloured categories." }
  - { date: "2026-10-29", rev: "D", change: "SEO landing pages, deep links to places and garages, spring street-sweeping warnings." }
  - { date: "2026-10-30", rev: "E", change: "Review fixes to the landing pages and the sweeping warnings." }
application: "Driving into the centre at 17:30 for two hours: set the time, and the map shows where the parking disc is enough, what the paid streets cost and which garage is cheapest."
specs:
  - { label: Platform, value: "Static web app, phone-first" }
  - { label: Data, value: "City of Tampere open geodata (CC BY 4.0), about 3,200 parking areas; garage operators' price lists" }
  - { label: Refresh, value: "Daily, GitHub Actions" }
  - { label: Hosting, value: "Cloudflare Pages; no server, no login" }
  - { label: Status, value: "Live, public" }
  - { label: Built, value: "2026" }
links:
  - label: Open Parkki
    url: https://parkki-tampere.pages.dev/
code: private
images:
  - src: ./01-desktop.png
    alt: "Parkki on a desktop: disc parking spots marked with clock icons along a street, and the details of one place."
    frame: browser
  - src: ./02-map.png
    alt: "The map on a phone around the city centre, with paid, disc and garage parking and the time picker at the bottom."
    frame: phone
  - src: ./03-disc.png
    alt: "A disc parking place: set the disc to 12.00 and leave by 14.00."
    frame: phone
  - src: ./04-garage.png
    alt: "A parking garage with the price for a two-hour stay and its price list."
    frame: phone
---

## The problem

Parking rules in Tampere are spread across signs, a city map layer and each garage operator's price page. To answer
"can I park here from 17:30 for two hours, and what does it cost?" you have to read all of them.

## What it does

You pick when you arrive and how long you stay. Every one of the city's ~3,200 parking areas is coloured for that
exact span:

- disc parking, with the time to set the disc to;
- free;
- paid, with the price for the whole stay;
- a garage, with its price;
- not allowed: a time limit, a winter maintenance ban or permit holders only.

Tap a place for its rules, its price and directions. "Nearest" lists the closest places you can use.

## How it's built

- A daily data pipeline on GitHub Actions turns the city's open geodata and the garage operators' public price pages
  into compact JSON. If a source fails, it keeps the last good data.
- A rules engine evaluates one area for one time span. It handles Finnish public holidays, paid and disc hours, time
  limits, winter maintenance and spring street sweeping.
- It is fully static: React and MapLibre in the browser, no server and no login, and your location stays on the phone.
  It is hosted on Cloudflare Pages.
