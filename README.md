# Pose Tracker

A real-time browser-based pose tracking app built with React, TypeScript, and MediaPipe.

## What it does

- Opens your webcam and shows the live feed in the browser
- Detects your body pose using MediaPipe's Pose Landmarker model
- Draws a skeleton overlay directly on the video — lines connecting every major joint, dots at each landmark
- Displays all 13 tracked joints as live-updating data (x, y, z coordinates + visibility confidence) in a panel beside the video

## Tech stack

- **React 19 + TypeScript** — UI and component logic
- **Vite 8** — dev server and build tool
- **MediaPipe Tasks Vision** — pose landmark detection running fully in the browser (no server needed)
- **HTML5 Canvas** — video frame rendering and skeleton drawing

## Running locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

> **Camera permission** — the browser will ask for camera access. You must allow it.

## How to get good tracking

- Stand **far enough back** that your full body is visible (head to ankles)
- Use **good lighting** — dim rooms reduce detection accuracy
- **Side-on** works better than front-facing for lower body joints
- Avoid clothing that blends into the background

## Project structure

```
src/
  hooks/
    usePoseTracking.ts   Core hook — camera, model, detection loop, drawing, pose state
  App.tsx                Main UI component
  App.css                Layout and component styles
  index.css              Global dark theme and CSS variables
  main.tsx               React entry point
```

## Branches

| Branch | Contents |
|--------|----------|
| `main` | Current clean pose tracker |
| `temp` | Earlier version with exercise coaching, MoCap recording, puppet Stage canvas, JSON/HTML export |
