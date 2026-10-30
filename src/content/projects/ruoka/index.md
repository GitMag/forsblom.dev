---
title: Ruoka
subtitle: Grocery spending tracker
tagline: "Turns grocery receipts into answers: where the money goes, what got more expensive and what to buy cheaper this week."
tags: [Web app, Data, AI]
card: featured
order: 1
stack: [TypeScript, Node.js, SQLite, Hono, React, Vite, vitest, Open Food Facts, LLM search]
code: private
images:
  - src: ./01-basket.png
    alt: "The basket index: what the things you buy cost now compared with a year ago, up 6,5 % on a 13-month chart."
    frame: phone
  - src: ./02-overview.png
    alt: "The overview: this week's shopping list, a line charged above the shelf price and new price rises in what you buy."
    frame: phone
  - src: ./03-product.png
    alt: "A product: cheaper cheeses on the same shelf per kilo, and its shelf price history against what you paid."
    frame: phone
  - src: ./04-offers.png
    alt: "For you this week: offers matched to what you buy and when you'll need it, with a stock-up suggestion."
    frame: phone
  - src: ./05-receipt.png
    alt: "A receipt with the check: one line charged 0,60 € above the shelf price."
    frame: phone
  - src: ./06-coupons.png
    alt: "The coupon autopilot set to activate coupons for what you buy, and its activation log."
    frame: phone
---

## The problem

Food prices keep moving, and a receipt tells you what you paid, but not whether it was a good price, what went up
since last month or what the cheaper choice would have been.

## What it does

- Downloads your Lidl Plus receipts (the whole history) and shows spending per month, category and product, plus a
  basket index: what the things you buy cost now compared with a year ago.
- Follows the store's whole shelf price list, about 37,000 products, every day and keeps only the changes. That gives
  every product a price history and warns when something you buy regularly gets more expensive.
- Checks each receipt line against the shelf price at the time and flags lines that were charged more.
- Finds cheaper alternatives by price per kilo and per 100 g of protein, using pack sizes and nutrition data from
  Open Food Facts.
- Matches this week's Lidl and K-Ruoka offers against what you actually buy, and suggests stocking up on long-life
  products you use when they are at least 20 % off.
- Coupon autopilot (opt-in): activates your Lidl Plus coupons so none are forgotten at the checkout, keeps a log of
  what it activated, and shows how far you are from this month's bonus coupon.
- Understands searches like *lactose-free yoghurt under 2 €*: code reads the price limit and an AI model turns the
  rest into filters.

## How it's built

- TypeScript on Node 24 with its built-in SQLite. One core serves both a command-line tool and a phone-first web app
  (Hono API, React and Vite), in Finnish and English.
- A background refresher keeps the offers and the price lists current and respects each source's rate limits.
- All the data stays in one database file on your own machine.
