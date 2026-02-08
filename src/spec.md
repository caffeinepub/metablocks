# Specification

## Summary
**Goal:** Rebrand the app as **PS PUZZLE** and deliver a puzzle-collection hub with at least five playable puzzle mini-games, including optional signed-in best-score persistence.

**Planned changes:**
- Update global layout and hub branding text from “Metablocks” to “PS PUZZLE” across user-facing UI.
- Replace the current home ("/") experience with a PS PUZZLE hub that shows a tile/grid menu of puzzle mini-games (title, short description, icon) and launches each puzzle screen.
- Implement at least 5 distinct puzzle mini-games, each with a start/new game action, reset/retry, an end/completion state, and a displayed numeric score, plus navigation back to the hub.
- Add signed-in persistence for best scores per puzzle (keyed by Internet Identity principal), and display best scores on the hub when available; keep puzzles playable while signed out with saving gated behind sign-in.
- Update routing so each puzzle is a first-class route and remove/disable entry points to the old Metablocks mode routes from the primary hub experience.
- Add and use new static branding assets (logo, hub background) and puzzle icons from `frontend/public/assets/generated` in the PS PUZZLE hub UI.

**User-visible outcome:** Users land on a PS PUZZLE hub with puzzle tiles that launch at least five different puzzle mini-games; each game tracks a numeric score and ends with a completion state, and signed-in users can save and see their best scores per puzzle on the hub.
