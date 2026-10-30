---
title: Tunnit
subtitle: Hours and pay for part-time work
tagline: Log your work hours and see what each payday really brings, before the payslip arrives.
tags: [Web app, PWA, Offline]
card: small
order: 4
stack: [TypeScript, React, TanStack Query, Hono, SQLite, vitest, Playwright, PWAs]
accent: "#c8651b"
why: "I wanted to see my real net pay before the payslip arrives, not after."
diagram:
  inputs:
    - "Clock in and out, daily hours (works offline)"
    - "Tax card and student aid settings"
    - "Payslip PDF"
    - "Employer's Excel timesheet"
  core:
    - "Pay rules in whole cents: withholding, pension and unemployment contributions"
    - "Hono API"
    - "SQLite, one file"
  outputs:
    - "Today, Pay and Year screens"
    - "Limit warnings"
    - "Timesheet back as Excel"
history:
  - { date: "2026-10-26", rev: "A", change: "Scaffold: server, database, sign-in, installable app shell." }
  - { date: "2026-10-26", rev: "B", change: "Pay rules with tests: holidays, lunch breaks, pay periods, tax and contributions." }
  - { date: "2026-10-26", rev: "C", change: "Today and Entries screens with an offline outbox." }
  - { date: "2026-10-26", rev: "D", change: "Pay and Year screens, payslip check, tax card and student aid limits." }
  - { date: "2026-10-26", rev: "E", change: "Excel timesheet export and import; payslip PDF import." }
application: "When the payslip arrives: the net pay is already worked out, the payslip is checked line by line, and you can see how much room is left under the student aid limit."
specs:
  - { label: Platform, value: "Installable web app (PWA), works offline" }
  - { label: Rules, value: "Finnish withholding tax, pension and unemployment insurance contributions, Kela's student aid income limit" }
  - { label: Storage, value: "One SQLite file" }
  - { label: Languages, value: "Finnish, English" }
  - { label: Status, value: "In daily use" }
  - { label: Built, value: "2026" }
code: private
images:
  - src: ./01-today.png
    alt: "The Today screen while clocked in: hours and earnings so far and a big Stop work button."
    frame: phone
  - src: ./02-pay.png
    alt: "The next pay: net per job, then the month's hours, gross pay and withholding."
    frame: phone
  - src: ./03-year.png
    alt: "The year view: a warning that the tax card's income limit is near, and the totals to date and forecast."
    frame: phone
  - src: ./04-entries.png
    alt: "A week of entries for two jobs, with today's shift still running."
    frame: phone
---

## The problem

With part-time jobs, the net pay depends on the hours, the tax card, the pension and unemployment insurance
contributions and, for students, the student aid income limit. That is hard to work out in your head and easy to get
wrong.

## What it does

- Clock in and out with one tap, or log hours per day, for one job or several. Finnish public holidays and lunch
  breaks are handled for you.
- For each payday it shows the gross pay, the withholding tax, the pension and unemployment insurance contributions
  and the net pay.
- It warns before you reach the tax card's income limit or Kela's student aid income limit.
- It reads the payslip PDF and checks it line by line against the logged hours.
- It writes the employer's monthly timesheet as the Excel file they expect, and reads their files back.
- It works offline: clock-ins made without a connection are saved and sent later. It installs to the home screen and
  works in Finnish and English.

## How it's built

- The pay rules are pure, fully tested functions that use whole-cent integer arithmetic, so there is never a rounding
  error in money.
- It is built on the same stack as Sali: Hono, SQLite and React in one Node process.
