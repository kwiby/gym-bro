# Project Context

Read this file at the start of every new chat to restore full project context.

---

## Project name

Pose Tracker (repo: `Gym_bro`)

## GitHub

- Remote: `https://github.com/AndrewLu-1/Gym_bro.git`
- Active branch: `main`
- `temp` branch holds the earlier, more complex version of the app

## What this project is

A browser-based real-time pose tracking app. It uses the device webcam and MediaPipe to detect body landmarks, draws a live skeleton overlay on the video feed, and exposes all joint positions as typed React state that updates every frame as the user moves.

This started as a fitness coaching tool (exercise form checker with rep counting), went through a major rewrite into a dual-canvas MoCap system, then was reset to a clean minimal pose tracker on `main`.

---

## Current state of `main`

### What works
- Webcam opens and streams to a canvas element
- MediaPipe Pose Landmarker (lite model) runs in VIDEO mode, tries GPU delegation first and silently falls back to CPU
- Skeleton overlay draws on top of the live video — teal lines connecting joints, white/amber dots at each landmark
- `PoseData` React state updates ~15 fps with named joint objects (`poseData.leftKnee.x`, `poseData.rightWrist.screenX`, etc.)
- Right panel shows all 13 joint coordinates and visibility confidence live
- Source map noise from `@mediapipe/tasks-vision` is suppressed

### Known fixed bugs (do not reintroduce)
- **Video freeze**: rAF was scheduled at the end of `processFrame`. If `detectForVideo` threw, the loop died. Fixed by scheduling rAF at the TOP of the frame function first.
- **Skeleton lines never drawing**: `isLandmarkVisible` used `visibility ?? 0` as fallback. MediaPipe Tasks Vision returns `visibility` as optional — when undefined, every landmark failed the check. Fixed to `visibility ?? 1`.
- **Canvas/video misalignment**: video was a separate element with CSS `transform: scaleX(-1)` and `object-fit: cover`. The canvas overlay didn't match. Fixed by drawing the video frame directly on the canvas with `ctx.scale(-1,1)`, and mirroring landmark x coordinates with `(1 - x) * width`.
- **WASM load error (Module.arguments)**: Vite pre-bundled `@mediapipe/tasks-vision` and broke its WASM bootstrapping. Fixed with `optimizeDeps: { exclude: ['@mediapipe/tasks-vision'] }` in `vite.config.ts`.
- **Detection before video ready**: `play()` resolving does not guarantee `videoWidth` is non-zero. Fixed by awaiting a `loadedmetadata` promise before starting the loop, plus an explicit `videoWidth === 0` guard inside the loop.
- **Missing source map error**: `vision_bundle.mjs` references a `.map` file not shipped in the package. Fixed by creating an empty valid map file at `node_modules/@mediapipe/tasks-vision/vision_bundle_mjs.js.map` and adding a `postinstall` script to recreate it after `npm install`.

---

## Architecture

### Entry point
`src/main.tsx` → `src/App.tsx`

### Core hook: `src/hooks/usePoseTracking.ts`

This file contains everything. Understand this file and you understand the whole app.

**What it does:**
1. Loads the MediaPipe Pose Landmarker model on mount (GPU → CPU fallback)
2. `startCamera()` — requests webcam, awaits `loadedmetadata`, plays video, starts the rAF loop
3. `stopCamera()` — tears down stream, cancels rAF, clears canvas
4. `tick()` (rAF loop):
   - Draws mirrored video frame on canvas (`ctx.scale(-1,1)`)
   - Calls `poseLandmarker.detectForVideo(video, performance.now())`
   - Calls `drawSkeleton()` to draw lines + dots over the video
   - Every 4th frame, calls `setPoseData(buildPoseData(...))` to update React state

**Key types exported:**
- `Joint` — `{ x, y, z, visibility, screenX, screenY }` — normalized coords + pixel position
- `PoseData` — named joints (nose, leftShoulder, rightShoulder, leftElbow, rightElbow, leftWrist, rightWrist, leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle) + `raw` array + `capturedAt` timestamp
- `ModelStatus` — `'loading' | 'ready' | 'error'`
- `CameraStatus` — `'idle' | 'starting' | 'live' | 'error'`

**Landmark indices used (MediaPipe Tasks Vision):**
```
nose: 0, leftShoulder: 11, rightShoulder: 12,
leftElbow: 13, rightElbow: 14, leftWrist: 15, rightWrist: 16,
leftHip: 23, rightHip: 24, leftKnee: 25, rightKnee: 26,
leftAnkle: 27, rightAnkle: 28
```

**Skeleton connections drawn:**
Left/right shoulder, shoulder–elbow, elbow–wrist, shoulder–hip, hip–hip, hip–knee, knee–ankle, nose–shoulder (both sides).

**Visibility rule:** `(landmark.visibility ?? 1) >= threshold` — landmarks without a visibility value are treated as visible. Threshold is `0.1` for both lines and dots.

**x-coordinate mirroring:** All draw calls use `(1 - landmark.x) * width` to mirror the skeleton to match the selfie-mode video.

### `src/App.tsx`

- Calls `usePoseTracking()`
- Left side: canvas element showing video + skeleton
- Right side: data panel with `JointRow` components showing live coords
- Start/Stop camera button in the top bar
- Badge showing model status and delegate mode (GPU/CPU)

### `src/App.css` + `src/index.css`

Dark theme (`#07111f` background). CSS variables in `index.css`:
`--bg`, `--panel`, `--panel-alt`, `--border`, `--text-high`, `--text-soft`, `--accent` (`#5cf9aa`), `--accent-dim`.

---

## Config files

### `vite.config.ts`
```ts
optimizeDeps: { exclude: ['@mediapipe/tasks-vision'] }
```
This is required. Without it, Vite pre-bundles the package and breaks WASM loading.

### `package.json` postinstall
```json
"postinstall": "node -e \"require('fs').writeFileSync('node_modules/@mediapipe/tasks-vision/vision_bundle_mjs.js.map', JSON.stringify({version:3,sources:[],mappings:''}))\" "
```
Creates a dummy source map so the browser doesn't log errors about a missing `.map` file.

---

## `temp` branch — what's there

The `temp` branch has a much more complex version. Key things that exist there that could be merged back:

- `src/lib/feedback.ts` — squat and pushup form analysis (knee angle, torso lean, elbow angle, body line), rep counting, spoken voice cues
- `src/lib/stage.ts` — procedural puppet character drawn from landmarks (torso quad, rounded limbs, hinge joints, head circle)
- `src/lib/smoother.ts` — 7-frame causal moving average for real-time smoothing + symmetric centered average for export
- `src/lib/exporter.ts` — JSON export and self-contained HTML player export
- Recording/timeline system — record frames with timestamps, playback, export
- GPU/CPU delegate logic (same as main)
- All the same bug fixes

---

## Likely next steps

1. **Add smoothing** — The `temp` branch has a working 7-frame moving average in `smoother.ts`. Merge it into the `usePoseTracking` hook to reduce jitter.
2. **Add exercise detection back** — Bring `feedback.ts` from `temp` into `main`. Plug it into the hook's per-frame analysis.
3. **Add a recording/playback system** — Capture frames + timestamps, play back on a separate canvas.
4. **Add the Stage puppet canvas** — `stage.ts` from `temp` draws a procedural character from the same landmark data.
5. **Rep counting** — Was working in `temp`. Can be added as a simple state machine on top of the joint angle data.
6. **Mobile layout** — Currently responsive but not tested on phone.

---

## How to resume work in a new chat

1. Read this file
2. Read `README.md`
3. Run `git log --oneline -10` to see recent commits
4. Run `git status` to check for local changes
5. Read `src/hooks/usePoseTracking.ts` — it contains the entire core logic
6. If working with the old features, `git show temp:src/lib/feedback.ts` etc. to read files from the other branch without checking out

---

## Run commands

```bash
# Install dependencies (also runs postinstall to create the source map stub)
npm install

# Start dev server
npm run dev
# Open http://localhost:5173

# Type check
./node_modules/.bin/tsc --noEmit

# Build for production
npm run build
```
