# HYPER V — Energy Drink Website

A clone of the HYPER V poster/landing page, built with **React 19 + JavaScript**, **Tailwind CSS v4**, and **Framer Motion**.

## Features

- Animated hero with the three cans (Neon Rush, Turbo Tropic, Arctic Pulse) floating in, matching the poster layout
- "Energy / Focus / Performance" feature row
- Interactive flavor showcase with animated tab switcher, stat bars, and crossfade transitions
- Shop grid with an animated cart counter
- Responsive down to mobile, dark neon aesthetic

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Structure

```
src/
  assets/             can artwork (cropped from the source poster)
  data/flavors.ts     flavor content, colors, stats
  components/
    Navbar.tsx
    Hero.tsx
    FlavorShowcase.tsx
    Shop.tsx
    Footer.tsx
  App.tsx
  index.css           Tailwind v4 theme tokens
```
