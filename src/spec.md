# Specification

## Summary
**Goal:** Restore Metablocks as the primary app hub at `/`, with Metablocks branding, mode navigation, and assets.

**Planned changes:**
- Replace the current `/` hub with a Metablocks-branded hub showing 6 mode tiles: Endless Run, City Builder, Farming, Indoor (minigames), Car Racing, and Battle.
- Update app routing so each Metablocks mode has a first-class route under a consistent URL scheme, reachable from the hub, without 404/blank pages.
- Rebrand primary UI chrome on the hub and shared header to “Metablocks” (English text) and remove prominent PS PUZZLE branding from those areas.
- Render Metablocks static assets from `/assets/generated` on the hub: Metablocks logo, Metablocks hub background, and one icon per mode tile; ensure PS PUZZLE hub assets are not used on the Metablocks hub.
- Keep the existing `/leaderboard` route accessible from the Metablocks hub.

**User-visible outcome:** Visiting `/` shows a Metablocks hub with branded visuals and 6 mode tiles; clicking a tile opens its playable mode page, and the leaderboard remains reachable from the hub.
