# Gym Bro

Web-based exercise form coach for ConHacks 2026.

## Stack
- React + TypeScript + Vite
- MediaPipe Pose Landmarker
- HTML video + canvas overlay
- Rule-based feedback for squats and pushups
- Browser speech synthesis for spoken cues

## Local Setup
```bash
npm install
npm run dev
```

Then open the local Vite URL in the browser, allow camera access, and use a side view for the clearest angle tracking.

## Current MVP Features
- Live camera feed
- Real-time pose detection
- Skeleton/keypoint overlay
- Squat and pushup angle checks
- Rep counting
- Spoken correction cues

## Project Handoff
See `PROJECT_SUMMARY.md` for the current implementation state and the recommended next steps.
