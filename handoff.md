# Session Handoff

_Last updated: 2026-06-22_

## Most recent work: Prayer Times widget upgrade (DONE, committed-pending)

Goal was: the global Prayer Times widget had three "pale" styles that looked
identical, and the user wanted prayer icons + general polish, including the
optional `accent` props.

### What shipped
- **`widgets/prayer-times.ts`** — added props (grouped under a "Display" accordion, half-width):
  - `accent` — Primary / Soft / Neutral (drives icons + active highlight color)
  - `showIcons` — toggle prayer icons (default on)
  - `highlightNext` — highlight the upcoming prayer (default on)
  - existing `showIqamah` / `showSunrise` moved into the same group
- **`app/components/widgets/WidgetPrayerTimes.vue`** — full rewrite:
  - **Fixed the core bug:** `table` and `compact` previously shared one `v-else`, so they rendered identically. Each variant is now a distinct branch.
  - **cards** — icon per card, large time, iqamah line, "NEXT" badge + accent ring on active prayer.
  - **table** — real Prayer/Adhan/Iqamah columns, zebra striping, icons, accent left-bar on active row.
  - **compact** — pill strip with icons + active highlight.
  - **list (`v-else` fallback)** — preserves the original divide-list used by templates passing `variant: 'feature-panel'`; now enhanced with icons + highlight.
  - Prayer icons map (sunrise→sun→cloud-sun→sunset→moon-star).
  - Live "next prayer": `currentMinutes` ref refreshed every 60s via setInterval (cleaned up in `onBeforeUnmount`); `nextName` picks first prayer with time ≥ now, wraps to tomorrow's first if all passed. Logic mirrors `WidgetPrayerCountdown.vue`.
  - Accent system: one `accentVar` computed drives icon color, active-row tint (`color-mix … 8% surface`), and date text across all variants.

### Backward-compat (verified, important)
- `sacred-modern` uses its own `SacredModernPrayerTimes` — untouched.
- `noor` and `fattan` use the **global** component with `variant: 'feature-panel'`. The first rewrite would have turned that into compact pills (regression). Fixed by making `compact` an explicit branch and adding the dedicated **list `v-else` fallback**. Verified `feature-panel` renders the divide-list on birmingham-central.

### Verification done
- All three variants + feature-panel fallback rendered & screenshotted on `birmingham-central`.
- Typecheck clean (no new prayer-times errors).
- Test tenant config **restored** to its original `{ props: { variant: 'compact' } }`.

## State of the tree
- Working tree had these two files modified (prayer-times widget). **Not yet committed** at session end — check `git status`.
- The running server during the session was `dev` (serves source). If you switch to `preview`, run `npm run build` first — the list-fallback edit is newer than the last `.output` build.

## Good next steps (not requested, optional)
- Commit the prayer-times changes if the user approves.
- Possible follow-ups from `context.md` "Next Steps": auth/session checks on editor APIs, automated tests for config normalize / PUT-GET round trips, lazy-load Tiptap + draggable, more template-specific overrides (noor/fattan hero/donation/footer), replace placeholder SVG media.

## Don't re-learn these (see CLAUDE.md for detail)
- Live editor = `SectionsTab.vue`; `SectionEditor.vue`/`GroupEditor.vue` are dead decoys.
- `PUT /api/tenant/<slug>/config` body is the draft DIRECTLY, not `{ config }`.
- Container queries need `@container` on an ancestor.
- Always restore tenant config after non-destructive render tests.
- Preview needs absolute `DATABASE_URL`; rebuild before QA under preview.
