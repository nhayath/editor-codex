# Session Handoff

_Last updated: 2026-06-23_

## Ongoing initiative: widget style/feature upgrades

The user is upgrading the global widgets one at a time — adding multiple visual
**styles (variants)**, more **admin-customisable props**, and live features —
**without breaking the custom templates** that consume them. Five widgets are
done (prayer-times, prayer-countdown, jummah-times, services, events,
announcements); **donation-cta is the natural next** — see the "Other candidate
widgets" section below. Apply the **same pattern**.

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

### 4. Services (`widgets/services.ts`, `WidgetServices.vue`) — newest
Variants: **grid(default) / list / cards / feature / overlay**. Props: `eyebrow`,
`accent`, `background`, `columns`(2/3/4), `align`, `imageRatio`, `showImage`,
`showIcon`, `showDescription`, `showCta`. **Featured images:** the `items`
textarea now parses **5 columns** — `Title|Description|Icon|Image URL|Link`
(`parsePipeRows(items, 5)`). Backward-compatible: old 3-col rows → empty
image/link → icon-tile fallback, no visual change. `cards` = image-topped cards,
`feature` = first service spotlighted + grid, `overlay` = image-bg cards with
scrim. `surface` background keeps the legacy transparent section (no card
wrapper); `solid`/`gradient` fill the whole section white-text. Empty-state added.
`showCta`+link renders a "Learn more →". Templates already pin variant
(modern `grid`, fattan `grid`, noor `list`) and the new defaults reproduce the
legacy look → **no template edits needed**. classic/sacred-modern have no
services section. Verified all 5 variants + 390px on birmingham-central
(temporarily switched to `modern` via non-destructive PUT); config restored.

### 5. Events (`widgets/events.ts`, `WidgetEvents.vue`) — newest
Variants: **grid(default) / list / cards / feature / agenda**. Props: `eyebrow`
(default "Programmes", was hardcoded), `accent`, `background`, `columns`(2/3/4),
`align`, `imageRatio`, `showImage`, `showCategory`, `showDate`, `showLocation`,
`showDescription`. Kept `title` + `maxItems`. **Data-driven** (DB `events`, not a
textarea) so `event.imageUrl` images need NO migration. `cards` = image-topped,
`feature` = first event spotlighted + grid, `agenda` = horizontal rows with a
day/month badge + thumbnail. Image variants fall back to a tinted calendar tile
(cards/feature) or omit the thumbnail (agenda) when `imageUrl` absent.
`endDate` renders as a range when present. Empty-state added. `surface` keeps the
legacy transparent cards; `solid`/`gradient` fill white-text. **No template edits
needed** — classic/modern already pin `variant: 'grid'`, noor/fattan pin
`variant: 'list'` (group `main` slot), and the new defaults reproduce the legacy
look. sacred-modern untouched (own `SacredModernEvents.vue`). Verified grid(390px),
cards, feature(gradient), agenda, list on birmingham-central via non-destructive
PUT with temp `imageUrl`s; config + dev.db restored (`git checkout prisma/dev.db`).

### 6. Announcements + Announcement Bar — newest

#### 6a. Announcements (`widgets/announcements.ts`, `WidgetAnnouncements.vue`)
Variants: **cards(default) / list / feature / ticker / banner**. Props: `eyebrow`
(default "Notices", was hardcoded), `accent`, `background`, `align`, `columns`
(2/3, cards only), `showIcon`, `showPriorityBadge`, `showContent`. Kept `title`,
`maxItems`, `showPinnedOnly`. **Data-driven** (DB `announcements`: title/content/
priority/isPinned). `feature` = top notice spotlighted + the rest listed; `cards`
and `list` reproduce the **exact legacy look** (single-col vs grid of surface ring
cards) so noor/sacred-modern (`list`) and classic (`cards`) are visually
unchanged. Empty-state added. Urgent → amber badge, pinned → neutral badge.
- **No template edits needed** — classic pins `variant:'cards'`, noor (group
  `side` slot) and sacred-modern pin `variant:'list'`; new defaults reproduce the
  legacy look. fattan/modern ship no announcements section. Verified
  banner/feature on birmingham-central via non-destructive PUT; cards baseline
  screenshot confirms unchanged; config restored to `{}`.
- **NOTE:** sticky was first prototyped as a prop on this widget, then **removed**
  in favour of a dedicated widget (see #7) — the announcements widget no longer
  has any sticky props.

#### 6b. Announcement Bar (`widgets/announcement-bar.ts`, `WidgetAnnouncementBar.vue`) — NEW, page-level chrome
A custom message pinned to the top of the page. **It is NOT a section** — it's
configured in the **Settings tab** (next to header/footer) and stored on the
homepage draft. History: first prototyped as a sticky prop on the announcements
widget, then as a draggable section widget — but a section is wrapped in a short
`<section class="tenant-section">` (`padding: 4rem 0`), and (a) `position:sticky`
inside such a short box un-sticks as soon as it scrolls past, and (b) since the
public site renders the bar at page level, the leftover section showed as an
**empty phantom box** in the flow + an extra row in the Sections list. Moving it
to Settings + a page-level render fixed both.

- **Storage:** `announcementBar?: { enabled, props } | null` on
  `HomepageConfigDraft` (`types/template.ts`), persisted as a JSON-string column
  `announcementBar String?` on `HomepageConfig` (Prisma) — mirrors `customColors`.
  Wired through `normaliseDraft` / `buildDraftFromDatabase` /
  `serialiseDraftForDatabase` in `utils/homepage.ts`. **A `db:push` is required**
  (column was added); restart the dev server after so the in-memory Prisma Client
  picks up the column (otherwise PUT /config 500s).
- **Editing:** `app/components/editor/tabs/SettingsTab.vue` → new
  `announcementBar` panel (root menu entry "Announcement bar"). An enable
  `USwitch` + the shared **`PropFieldGroups`** renderer bound to the
  `announcementBarWidget.propSchema`. Updates mutate
  `editor.draft.value.announcementBar` directly → `configDirty` (full-draft
  JSON compare) picks it up → saved via the existing `PUT /config`. Enabling for
  the first time **seeds schema defaults** into `props` (the component's own prop
  defaults are empty, so without seeding the bar would render blank).
- **Rendering (page level, a direct child of `.tenant-site`):**
  `app/pages/site/[slug].vue` and `app/components/editor/EditorPreview.vue` both
  read `config.announcementBar` (resp. `editor.draft.value.announcementBar`) and
  render `<WidgetAnnouncementBar v-bind="props">` above the header when
  `enabled`. Page-level placement = containing block spans the whole page →
  sticky pins across the entire scroll.
- **NOT in the Add-widget picker:** `announcementBarWidget` is intentionally
  **removed from `widgets/index.ts`** (the registry that feeds `/api/widgets`),
  so it can't be added as a section. The def file still exports the widget so its
  `propSchema` drives the Settings panel.
- **Props:** `variant` single/rotating, `messages` (textarea, one per line,
  `Text|Link label|URL`), `rotateSeconds` (rotating), `sticky` (default true),
  `dismissible` (default true), `background` (default `solid`), `accent`,
  `align` (default center), `icon`, `showIcon`.
- **Component:** full-width bar (`w-full`) with an inner `.tenant-container`;
  shared accent/background system; `sticky top-0 z-50 shadow-md` when sticky;
  rotating cycles on a timer (`onBeforeUnmount` clear); dismiss is client-only
  `localStorage` keyed by a hash of the message text, SSR-guarded.
- **Verified** on birmingham-central: non-destructive `PUT /config` with
  `announcementBar.enabled` renders the page-level sticky bar (gradient, link);
  config restored to `null`. In the editor, Settings → Announcement bar → toggle
  on renders the bar above the header in the preview with **no phantom section**
  in the Sections list (screenshotted). Typecheck clean.

## State of the tree
- Modified, uncommitted (branch `widget/events`): the prayer trio + their
  templates, `widgets/services.ts` + `WidgetServices.vue`, `widgets/events.ts` +
  `WidgetEvents.vue`, and `handoff.md`. Confirm with `git status`.
- Session server was `dev` (serves source live). If you switch to `preview`, run
  `npm run build` first.

---

## NEXT UP: donation-cta widget

The remaining single-style widgets are below. Apply the **exact same pattern**
(see top of this file). Most are textarea/data-driven like services/events —
check `dataDependencies` and whether each pulls from the DB or a prop before
starting.

## Other candidate widgets
donation-cta, quick-links, about-mosque, contact, gallery, carousel — all
single-style/minimal-prop. (hero already has multiple styles.)

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
