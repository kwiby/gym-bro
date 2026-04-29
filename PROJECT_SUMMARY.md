# Gym Bro Project Summary

## Goal
Build a browser-based exercise coach that uses the webcam plus pose estimation to track body landmarks, draw a skeleton overlay, calculate joint angles, and give live form feedback for squats and pushups.

## Current Status
Current phase: MVP foundation implemented.

Completed now:
- React + TypeScript app scaffolded with Vite
- MediaPipe Pose Landmarker integrated for real-time pose detection
- Live camera feed wired through an HTML `video` element
- Canvas overlay added for skeleton and keypoint drawing
- Rule-based angle analysis added for squats and pushups
- Rep counting added using simple top/bottom phase detection
- Browser speech synthesis added for spoken correction cues
- README replaced with project-specific setup notes

Not done yet:
- Better exercise heuristics and more robust thresholds
- Pushup and squat calibration flow per user/camera position
- Smoothing/filtering to reduce landmark jitter
- Dedicated audio assets or richer voice feedback control
- Optional ML classifier for more advanced form recognition
- Persistence, workout history, or multi-exercise session flow

## Tech Decisions
- Frontend: React + TypeScript + Vite
- Pose model: MediaPipe Pose Landmarker via `@mediapipe/tasks-vision`
- Rendering: native canvas overlay on top of mirrored webcam video
- Feedback logic: rule-based angle thresholds first
- Voice feedback: browser `speechSynthesis`

## Important Files
- `src/App.tsx`: main UI, camera lifecycle, model loading, processing loop, rep counting, spoken cues
- `src/lib/pose.ts`: skeleton drawing and angle helpers
- `src/lib/feedback.ts`: squat and pushup rule logic
- `src/App.css`: app-specific layout and panel styling
- `src/index.css`: global theme and base styles
- `README.md`: local setup and usage notes

## How the MVP Works
1. User starts the camera.
2. The video stream is shown in the browser.
3. MediaPipe Pose Landmarker runs on each frame.
4. Landmarks are drawn as a skeleton on the canvas overlay.
5. Joint angles are calculated from visible landmarks.
6. The current exercise logic checks depth, torso position, and body line.
7. Text feedback updates live.
8. If a correction is needed, a spoken cue is played.

## Current Rule Logic
### Squat
- Uses one visible side of the body
- Main metrics: knee angle, hip angle, torso lean
- Current feedback checks:
  - whether depth is deep enough
  - whether the chest is dropping too far forward

### Pushup
- Uses one visible side of the body
- Main metrics: elbow angle and shoulder-hip-ankle body line
- Current feedback checks:
  - whether depth is low enough
  - whether the body line is breaking at the hips

## Known Limitations
- Best results currently require a side view
- Thresholds are heuristic and not personalized yet
- No smoothing means jitter may cause noisy phase changes
- Audio uses browser voice synthesis, not prerecorded coaching
- Model assets are loaded from remote URLs at runtime

## Recommended Next Steps
1. Add landmark smoothing and rep debouncing to reduce jitter.
2. Add a short onboarding/calibration step that tells the user how to stand in frame.
3. Improve squat logic with more checks such as stance consistency or tempo.
4. Improve pushup logic with better detection of incomplete reps.
5. Decide whether to stay fully rule-based or add an ML classifier later.
6. Add tests around angle and feedback helper functions.

## If a New Chat Starts
You should continue from: improving the MVP quality, not rebuilding the scaffold.

What already exists:
- the app runs in React/TypeScript
- pose detection is connected
- skeleton drawing works
- angle-based feedback exists for squats and pushups
- voice correction cues exist

What to work on next first:
- smoothing landmark updates
- reducing false rep counts
- tightening the feedback thresholds after real testing
