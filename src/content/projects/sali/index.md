---
title: Sali
subtitle: Gym tracker
tagline: A gym tracker for a few friends, made for logging between sets.
tags: [Web app, PWA]
card: featured
order: 3
stack: [TypeScript, React, TanStack Query, Hono, SQLite, Vite, vitest, Playwright, PWAs]
accent: "#0e8a7a"
why: "I wanted logging a set to take one thumb and two seconds, and to share my workouts with friends."
diagram:
  inputs:
    - "Phone, one thumb between sets"
    - "Invite and password-reset links"
    - "Exercise library"
  core:
    - "Hono API"
    - "SQLite, one file"
    - "Sessions, remembered weights and progress"
    - "Suggestions and weekly summary (AI)"
  outputs:
    - "Installable web app, Finnish and English"
    - "End-to-end test of every screen"
history:
  - { date: "2026-10-18", rev: "A", change: "Accounts, invites and sessions backend; remembered weights; history." }
  - { date: "2026-10-19", rev: "B", change: "The logging screen, rest timer, progress charts and records." }
  - { date: "2026-10-20", rev: "C", change: "AI notes when progress stalls, and a weekly summary." }
  - { date: "2026-10-24", rev: "D", change: "Alternative exercises on the logging screen; in use on a home server." }
  - { date: "2026-10-26", rev: "E", change: "Drag to reorder workouts, and a recovery view per muscle group." }
application: "Between sets: tick the set with one thumb, the rest timer starts by itself, and next time the app suggests the weight to try."
specs:
  - { label: Platform, value: "Installable web app (PWA)" }
  - { label: Users, value: "A few friends, each with their own sign-in" }
  - { label: Storage, value: "One SQLite file" }
  - { label: Hosting, value: "Home server, reached over Tailscale" }
  - { label: Languages, value: "Finnish, English" }
  - { label: Status, value: "In use" }
  - { label: Built, value: "2026" }
code: private
images:
  - src: ./01-train.png
    alt: "The Train screen: your workouts with the next one highlighted, and a workout a friend shared."
    frame: phone
  - src: ./02-logging.png
    alt: "Logging a bench press set: weight and reps steppers, the sets ticked off and the rest timer running."
    frame: phone
  - src: ./03-progress.png
    alt: "An exercise's progress: the estimated one-rep max over time, the suggestion for next time and personal records."
    frame: phone
  - src: ./04-recovery.png
    alt: "The Progress screen: which muscles are still recovering and the sets per week."
    frame: phone
---

## The problem

Gym apps are either bloated or locked to one person. I wanted one that is fast enough to use between sets and that a
few friends can share.

## What it does

- Everyone has their own sign-in, their own workouts and remembered weights per exercise, and gym buddies can share a
  workout.
- A logging screen made for one thumb, a rest timer that keeps the screen on, and progress per exercise.
- It installs to the phone's home screen and works in Finnish and English.

## How it's built

- One Node process: Hono serves the API and the React app, and all the data is a single SQLite file.
- New people join through invite links. There are one-time links for the first admin and for password resets.
- An end-to-end test walks every screen on a headless phone, in both languages and both themes.
