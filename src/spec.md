# Specification

## Summary
**Goal:** Build the Metablocks online game hub with Internet Identity sign-in, multiple playable MVP game modes, persistent player progression, leaderboards, and a cohesive non-blue/purple-dominant visual theme.

**Planned changes:**
- Create the Metablocks hub UI showing 6 modes (Endless Run, City Builder, Farming, Indoor, Car, Battle) plus a Leaderboard screen; enable entering/exiting modes without page reloads.
- Integrate Internet Identity sign-in/out and display signed-in state (including principal/identifier); gate saving/loading of online progress behind sign-in.
- Implement a single Motoko backend actor for per-principal persistence: player profile (optional display name), total coins, per-mode best scores/times, last played timestamps, and mode-specific saved states; expose getPlayer(), upsertPlayerProgress(...), and getLeaderboard(mode, limit).
- Implement MVP versions of each mode:
  - Endless Run: start/running/game-over loop with score and coin rewards; persist results on game over for signed-in users.
  - City Builder: grid placement with at least 3 building types/costs; validate coins; persist/reload city layout for signed-in users.
  - Farming: at least 3 crops with plant→grow (time-based)→harvest loop; persist plots and growth via timestamps for signed-in users.
  - Indoor: submenu with at least 2 minigames, each with scoring/end condition and coin rewards; persist best scores for signed-in users.
  - Car: simple time-trial with timer and best time; persist best time for signed-in users.
  - Battle: turn-based player vs CPU with HP/attack and at least 3 actions; persist wins count and best streak (or equivalent) for signed-in users.
- Add a global leaderboard UI that can switch per mode and shows top entries plus signed-in user rank when available.
- Apply a cohesive visual theme across hub and all modes (consistent styling, readable/accessibile), avoiding blue/purple as the primary palette.
- Add and render generated static branding/UI images from frontend static assets (logo, hub background, and per-mode icons).

**User-visible outcome:** Users can open Metablocks, sign in with Internet Identity, choose any of the 6 modes from a themed hub, play each mini-game, earn coins, and (when signed in) have their progress saved and reflected in the hub and leaderboards across sessions.
