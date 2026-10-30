---
title: Sali
subtitle: Gym tracker
tagline: A gym tracker for a few friends, made for logging between sets.
tags: [Web app, PWA]
card: featured
order: 3
stack: [TypeScript, React, TanStack Query, Hono, SQLite, Vite, vitest, Playwright, PWAs]
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
