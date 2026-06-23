# Session Handoff

_Last updated: 2026-06-23_

## Ongoing initiative: widget style/feature upgrades

The user is upgrading the global widgets one at a time — adding multiple visual
**styles (variants)**, more **admin-customisable props**, and live features —
**without breaking the custom templates** that consume them. Three widgets are
done; expect the next session to apply the **same pattern** to another widget.

### The reusable pattern (follow this for the next widget)

1. **Widget def (`widgets/<id>.ts`)**
   - Add a `variants: [{ id, name }]` array (the picker chips).
   - Add a `variant` select as the **first** prop (default = the variant that
     reproduces the CURRENT look, so existing tenants don't change).
   - Put new tuning props in `group: 'Display'`, mostly `span: 'half'`, toggles.
2. **Component (`app/components/widgets/Widget<X>.vue`)**
   - `withDefaults(defineProps<…>())` — declare every new prop with a default
     matching the schema default.
   - One `<template v-if / v-else-if / v-else>` branch per variant; the **`v-else`
     is the legacy/default look** (safest fallback).
   - Reuse the **shared accent + background system** (copy the computeds from
     `WidgetPrayerCountdown.vue` / `WidgetJummahTimes.vue`): `accentVar`,
     `isFilled` (`background !== 'surface'`), `containerStyle` (surface/solid/
     gradient), `headingColor`/`mutedColor`/`accentTextColor`/`hairlineColor`/
     `trackColor`/`barColor`. Solid+gradient = filled white-text; surface = light
     themed card. This keeps every widget visually consistent.
   - For live/time features: `now = ref<Date|null>(null)`, `tick()` every 1000ms
     in `onMounted`, `onBeforeUnmount(clearInterval)`. `toSeconds('HH:MM')` helper.
   - Root element: `class="@container h-full overflow-hidden rounded-lg p-6"` +
     `:style="containerStyle"`. Must not horizontally overflow at 390px (side slots).
3. **Templates** — set an explicit `variant: '<current-look>'` in each template's
   `defaultProps` for that widget, so the appearance is locked even if the schema
   default ever changes. **Grep `templates/` + `app/components/templates/` first**
   to find which templates use the widget and whether any ship a component
   override (those are untouched — see below).
4. **Backward-compat** — keep deprecated props declared in the component and map
   them to the nearest new variant (e.g. prayer-countdown's `compact` → `minimal`)
   so old saved tenant configs don't break.

### Backward-compat gotchas learned
- **sacred-modern** renders prayer-times AND jummah-times **inline inside its own
  `SacredModernPrayerTimes.vue`** — it does NOT use the global widgets. Changing a
  global widget never affects sacred-modern. (It's the one template to check is
  *not* impacted.)
- **noor / fattan** use the **global** components via the group `side`/`main`
  slots — they ARE affected, so verify them (or rely on the explicit `variant`).
- A shared `v-else` between two variants makes them render identically — that was
  the original prayer-times bug. Give each variant its own branch.

---

## Done this initiative (all DONE, NOT yet committed — check `git status`)

### 1. Prayer Times (`widgets/prayer-times.ts`, `WidgetPrayerTimes.vue`)
Variants: **cards / table / compact / list(feature-panel fallback)**. Added
`accent`, `showIcons`, `highlightNext`. Fixed the table/compact shared-`v-else`
bug. Prayer icon map sunrise→sun→cloud-sun→sunset→moon-star. Live next-prayer
(60s tick). `feature-panel` (noor/fattan) preserved via the list `v-else`.

### 2. Prayer Countdown (`widgets/prayer-countdown.ts`, `WidgetPrayerCountdown.vue`)
Variants: **card / banner / minimal / split**. Props: `accent`, `background`,
`align`, `precision` (minutes/seconds — live 1s tick), `showIqamah`, `showIcon`,
`showDate`, `showProgress`. Adhan-vs-Jamaah context label, progress bar, midnight
wrap. Legacy `compact` prop maps to `minimal`. Templates classic/modern/noor
updated to explicit `variant`.
- **Later tweak:** the card/banner/minimal main icon now uses the **per-prayer**
  lucide icon (`next.icon`, same map as Prayer Times) instead of a generic glyph.
  The split variant already used per-row icons.

### 3. Jumu'ah Times (`widgets/jummah-times.ts`, `WidgetJummahTimes.vue`) — newest
Variants: **card(default) / list / feature / timeline**. Props: `subtitle`,
`accent`, `background`, `align`, `showIcon`, `showLabel`, `showLocation`(kept),
`highlightNext`, `countdown`. **Friday awareness:** live 1s clock marks the next
upcoming slot ("Next" badge), dims passed slots, shows "in 2h 10m" when
`countdown` on; off-Friday shows a quiet "This Friday" note. Empty-state added.
Templates classic/noor/fattan set explicit `variant: 'card'`. sacred-modern
untouched (inline). All 4 variants verified on birmingham-central; config restored.
- **Data note:** `JummahTime` schema = `{ label?, time, location? }` only. Khateeb
  name / separate khutbah-start time were proposed as **Phase 2** (needs a Prisma
  migration) and deliberately NOT built.

## State of the tree
- Modified, uncommitted: `widgets/prayer-times.ts`, `widgets/prayer-countdown.ts`,
  `widgets/jummah-times.ts`, `app/components/widgets/WidgetPrayerTimes.vue`,
  `WidgetPrayerCountdown.vue`, `WidgetJummahTimes.vue`, and templates
  `classic.ts` / `modern.ts` / `noor.ts` / `fattan.ts` (explicit variants).
  Confirm with `git status` — branch is `widget/prayer-countdown`.
- Session server was `dev` (serves source live). If you switch to `preview`, run
  `npm run build` first.

## Good candidate widgets for the same treatment next
events, announcements, donation-cta, services, quick-links, about-mosque,
contact, gallery, carousel — all currently single-style or minimal-prop. Apply
the pattern above. (hero already has multiple styles.)

## Don't re-learn these (see CLAUDE.md for detail)
- Live editor = `SectionsTab.vue`; `SectionEditor.vue`/`GroupEditor.vue` are dead decoys.
- `PUT /api/tenant/<slug>/config` body is the draft DIRECTLY, not `{ config }`.
  Override path for a group slot: `sectionOverrides[sectionId].widgets[slot].props`.
- Container queries need `@container` on an ancestor; widgets must not overflow at 390px.
- Always restore tenant config after non-destructive render tests.
- Preview needs absolute `DATABASE_URL`; rebuild before QA under preview. `dev` serves source live.
- CLAUDE.md tenant→template map is partly stale: `east-london-ic` is actually
  `classic` in the seeded DB, not modern. `birmingham-central` = classic (best for
  testing global widgets).
