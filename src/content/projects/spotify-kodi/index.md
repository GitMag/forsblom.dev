---
title: Spotify for Kodi
subtitle: Spotify on the TV
tagline: "Spotify on the TV: browse and play your music in Kodi with a game controller."
tags: [Kodi add-on, Python]
card: small
order: 5
stack: [Python, Kodi add-on API, Spotify Web API, OAuth 2 (PKCE), D-Bus/MPRIS]
accent: "#d6457f"
application: "On the couch with a game controller: pick who's listening, put on an album and open the visualizer with the lyrics."
specs:
  - { label: Platform, value: "Kodi add-on on a Linux TV PC" }
  - { label: Control, value: "Game controller or phone" }
  - { label: Services, value: "Spotify Web API, the Spotify app over MPRIS (D-Bus), LRCLIB lyrics" }
  - { label: Status, value: "In daily use" }
  - { label: Built, value: "2026" }
code: private
video:
  src: /media/spotify-visualizer.mp4
  poster: ./00-visualizer-poster.jpg
  caption: "The visualizer in motion: karaoke-style lyrics over the album backdrop, then the lyrics switched off and the cover glides to the centre with its record."
images:
  - src: ./02-now-playing.jpg
    alt: "Now Playing: the album cover, the song and album, a progress bar and the playback, shuffle, repeat, like and visualizer buttons, over a backdrop in the album's colours."
    frame: tv
  - src: ./03-playlists.jpg
    alt: "The main menu: Search, Liked Songs, Playlists, Albums, Artists and Switch user in the sidebar, the playlists as a grid of covers, and the playing song in a bar at the bottom."
    frame: tv
---

## What it does

You can browse your playlists, albums, artists and Liked Songs, search, and see what's playing with synced lyrics,
all from the couch. A "Who's listening?" picker switches between accounts. Now Playing opens a full-screen visualizer:
the album art as a backdrop, the lyrics in time with the music and the song's waveform.

## How it's built

- The music plays in the official Spotify app running in the background, so playback and sound quality are Spotify's
  own.
- The add-on controls it through Spotify's Web API, signing in with OAuth and PKCE. It reads what's playing straight
  from the app every second, which uses none of the API quota.
- The synced lyrics come from LRCLIB, an open database.
