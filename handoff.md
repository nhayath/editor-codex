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

### 7. Donation CTA (`widgets/donation-cta.ts`, `WidgetDonationCta.vue`) — newest
Variants: **banner(default) / cards / featured / compact**. Props: `eyebrow`
(default "Giving", was hardcoded), `accent`, `background`, `align`,
`showProgress`, `showRaised`. Kept `title`, `subtitle`, `buttonLabel`.
**Data-driven** (DB `donation_campaigns`: title/description/goal/raised/
paymentUrl/isFeatured). `featured` = top campaign spotlighted with the amount
selector + the rest listed; `compact` = slim sidebar CTA; `cards` reproduces the
legacy grid; `banner` is the `v-else` legacy fallback. Replaced the old
hardcoded `bg-primary text-white` with the shared accent/background system —
**`banner` defaults to `background: 'solid'` + `accent: 'primary'` so the legacy
white-on-primary look is pixel-preserved.** `UProgress` swapped for a
`trackColor`/`barColor` bar. Empty-state added.

**NEW headline feature — donation amount selector** (opt-in, `showAmounts`
default **false** so existing tenants are unchanged): preset chips
(`presetAmounts`, default `10,25,50,100`) + an optional custom amount input
(`allowCustomAmount`) + an optional one-off/monthly toggle (`frequencyToggle`),
prefixed by `currencySymbol` (`£`). Selecting an amount appends
`?{amountQueryParam}={amount}` (default param `amount`) to the campaign's
`paymentUrl` (and `&frequency=monthly` when monthly) — the convention
JustGiving/LaunchGood/Donorbox/Stripe accept. **No Prisma migration** (prop-driven).
No amount selected → bare `paymentUrl` (current behaviour). Markup lives in a new
**`app/components/widgets/DonationAmountPicker.vue`** (auto-imported,
`pathPrefix:false`) shared across all variants; parent owns selection state +
URL building, passes a `colors` object so the picker matches the filled/surface
scheme.

**No template edits needed** — classic/fattan already pin `variant:'banner'`,
modern/noor pin `variant:'cards'` (noor via group `main` slot), and the new
defaults reproduce the legacy look. sacred-modern untouched (own
`SacredModernDonationCta.vue`, separate `split-card` override). Verified on
birmingham-central via non-destructive PUT: featured+gradient+amounts renders;
clicking £50 → `?amount=50`, Monthly → `&frequency=monthly`, custom £77 →
`?amount=77&frequency=monthly`; 390px stacks/wraps with no overflow; default
banner confirmed unchanged (solid primary, white text, no chips); config + dev.db
restored. Typecheck clean.
- **GOTCHA:** the new `DonationAmountPicker.vue` was added while `nuxt dev` was
  running → client bundle failed to auto-resolve it ("Failed to resolve
  component" + hydration mismatch); **restart the dev server** after adding a
  brand-new auto-imported component file. SSR found it fine; only the client
  manifest was stale.

## State of the tree
- Modified, uncommitted (branch `widget/events`): the prayer trio + their
  templates, `widgets/services.ts` + `WidgetServices.vue`, `widgets/events.ts` +
  `WidgetEvents.vue`, and `handoff.md`. Confirm with `git status`.
- Session server was `dev` (serves source live). If you switch to `preview`, run
  `npm run build` first.

---

### 8. Quick Links (`widgets/quick-links.ts`, `WidgetQuickLinks.vue`) — newest
Variants: **tiles(default) / rail / list / buttons / featured**. Props: `accent`,
`background`, `align`, `columns`(2/3, tiles grid), `showHeaderIcon`, `showIcon`
(per-link), `showDescription`, `showArrow`. Kept `title`, `eyebrow`, `items`
(textarea, still `Title|Description|URL|Icon` via `parsePipeRows(items, 4)`),
`featuredIcon` (now the header badge, gated by `showHeaderIcon`). **Prop-driven**
(no DB, no migration). `list` = compact hairline-divided rows; `buttons` = pill
chips, title-only-ish (icon + title + arrow); `featured` = first link spotlighted
large + the rest in a grid; `tiles`/`rail` are the `v-else` legacy bordered cards
(rail = single-col). Adopted the shared accent/background system — **`background`
defaults to `surface` so the legacy light card (ring, solid-primary icon badges,
white-on-primary) is pixel-preserved**; `solid`/`gradient` fill white-text with
translucent panels/badges. Empty-state added.
- **Templates:** noor uses the **global** widget in its `community-actions` group
  `main` slot — added explicit `variant: 'tiles'` to lock the look. sacred-modern
  overrides quick-links with its own **`SacredModernSupportLinks`** (`support-card`)
  → untouched. classic/modern/fattan ship no quick-links section.
- **Verified** on birmingham-central via non-destructive PUT (temporarily switched
  to `templateId: 'noor'` so the global widget renders, variants set via
  `sectionOverrides['community-actions'].widgets.main.props`): tiles(default legacy
  surface), featured+gradient, list, buttons+solid+center all render; 390px stacks
  with no overflow (`scrollWidth == clientWidth == 390`). Config restored to classic.
  Typecheck clean.

### 9. About Mosque (`widgets/about-mosque.ts`, `WidgetAboutMosque.vue`) — newest
Variants: **split(default/legacy) / stacked / overlay / statement / feature**.
Props: `eyebrow` (default "About", was hardcoded), `accent`, `background`
(`surface` = legacy transparent section / `solid` / `gradient` filled white-text),
`align`, `imageRatio` (landscape/square/portrait), `showImage`. Kept `title`,
`body` (richtext), `imageUrl`, `imagePosition` (now gated `showWhen` variant ∈
split/feature). **Prop-driven** (no DB, no migration). `stacked` = centered text
over a full-width image; `overlay` = image bg + scrim + text card; `statement` =
large text-only mission statement (image hidden); `feature` = split + stats/CTA
spotlighted; `split` is the `v-else` legacy look (text + image-in-ring card),
pixel-preserved. Adopted the shared accent/background system — **`background`
defaults to `surface` (transparent, no card wrapper) so the legacy two-column
look is unchanged**; `solid`/`gradient` wrap the section in a filled white-text
card (`rounded-lg p-6`).
- **NEW headline feature — highlight stats** (opt-in, `showStats` default
  **false** so existing tenants unchanged): `stats` textarea parsed `Value|Label`
  per line (`parsePipeRows(stats, 2)`), rendered as a small stat row/grid styled
  to the filled/surface scheme. Optional `ctaLabel` + `ctaUrl` button. Both live
  in a `group: 'Highlights'` accordion.
- **No component overrides anywhere** — all four templates (classic, noor,
  fattan, sacred-modern) use the GLOBAL widget via `defaultProps`; none ship a
  `widgets:` record or template component for about-mosque. Added explicit
  `variant: 'split'` to each of the four `defaultProps` to pin the look.
- **Verified** on birmingham-central (classic) via non-destructive PUT to
  `sectionOverrides['about-mosque'].props`: feature+gradient+stats+CTA renders
  (white heading, gold stat values, white CTA); overlay+center renders scrim +
  white stats/CTA; legacy `split` confirmed unchanged + stacks at 390px
  (`scrollW == clientW == 390`, no overflow). Override removed after; the other
  three overrides (prayer-times, prayer-and-jummah, custom-services) preserved.
  Build + typecheck clean.
- **GOTCHA (mine):** the `Write` tool call leaked its literal closing
  `</content></invoke>` tags into the bottom of `widgets/about-mosque.ts`,
  which only surfaced as an "Unterminated regular expression" at **build** time
  (typecheck/grep didn't catch it) — check the tail of a freshly-Written file if
  a build fails oddly right after.

### 9b. Rich-text editor UX (`PropField.vue`) — editor-wide, NOT just about-mosque
The `richtext` prop type renders Nuxt UI v4's `UEditor` (Tiptap WYSIWYG, HTML
output) — it was **never** Markdown. But `UEditorToolbar` renders **nothing**
unless you pass an explicit `items` prop (empty `items` → empty toolbar), so the
field looked like a bare text box. Fixed in `app/components/editor/panels/
PropField.vue`:
- Added a **curated fixed toolbar** (`richtextToolbar`, grouped array-of-arrays
  → separators): H2/H3 · Bold/Italic · Bullet/Numbered list · Link/Quote/Clear
  formatting. Intentionally small for non-technical mosque admins (no tables/
  code/etc.). Item shape: `{ kind, ... , icon, tooltip: { text } }` where `kind`
  ∈ the handlers in `@nuxt/ui .../utils/editor.js createHandlers()` (`mark` +
  `mark:'bold'|'italic'`, `heading` + `level`, `bulletList`, `orderedList`,
  `link`, `blockquote`, `clearFormatting`, …).
- Added a **bubble menu** — a second `<UEditorToolbar layout="bubble">` (same
  component, `layout` ∈ fixed/bubble/floating) with `richtextBubble` =
  Bold/Italic/Link, appears on text selection.
- **Applies to EVERY widget's richtext prop** (one shared branch in
  PropField.vue), e.g. about-mosque `body`, rich-text widget, etc. — by design,
  for consistency.
- StarterKit (bold/italic/headings/lists/link/blockquote) is on by default in
  UEditor, so all buttons are live; no extra extensions needed.
- **Verified** in the live editor (birmingham-central → Sections → About): fixed
  toolbar renders 9 buttons; selecting text pops the bubble (B/I/link); clicking
  bubble Bold wraps `<strong>`, toggling off restores. No console errors,
  typecheck clean, config not dirtied (override check came back clean).

### 10. Contact (`widgets/contact.ts`, `WidgetContact.vue`) — newest
Variants: **split(default/legacy) / cards / feature / compact / directory**.
Props: `eyebrow`, `accent`, `background`, `align`, `showIcons`, `showAddress`,
`showPhone`, `showEmail`, `showSocials`, `showDirections`. Kept `title`, `intro`,
and the settings data dependency. **Action-first details:** phone and email now
use `tel:` / `mailto:` links; optional directions opens an encoded Google Maps
search; social links use secure external targets. Address formatting omits empty
parts, and a settings-guided empty state replaces blank rows.
- **Backward-compatible:** `split` is the final `v-else`, `surface` preserves the
  legacy card, and `showDirections` defaults false so existing sites gain no new
  row. All five templates pin `variant:'split'`.
- **No migration/backend:** still reads TenantSettings address/city/postcode,
  phone, email, Facebook, Instagram, and YouTube.
- **Verified** on east-london-ic: all five variants, all 9 accent/background
  combinations, actionable URLs, visibility toggles, partial/missing settings,
  empty state, desktop and 390px with no overflow. Tenant settings + config
  restored. Production build clean. Repo-wide typecheck remains blocked by
  pre-existing errors in EditorPreview, SectionsTab, WidgetAnnouncementBar, and
  WidgetServices; no contact errors were reported.

### 11. Gallery (`widgets/gallery.ts`, `WidgetGallery.vue`) — newest
Variants: **grid(default/legacy) / masonry / mosaic / featured / filmstrip**.
Props: `eyebrow`, `intro`, `accent`, `background`, `align`, `columns`,
`imageRatio`, `showCaptions`, and `showLightbox`. Kept `title`, `imageUrls`, and
`variant`. Image rows now accept **`Image URL|Alt text|Caption`** while old
URL-only rows remain valid. Missing alt text falls back to caption, then the
gallery title plus image number.
- **Lightbox:** optional click-to-enlarge viewer with previous/next controls,
  Escape and arrow-key navigation, body scroll locking, accessible labels, and
  captions.
- **Backward-compatible:** `grid` is the final `v-else`; `masonry` remains a
  distinct branch; `surface`, three columns, landscape ratio, and hidden
  captions preserve the resting legacy appearance. Modern remains explicitly
  pinned to `variant:'masonry'`; no other template ships the gallery.
- **No migration/backend:** images remain prop-driven URLs. Empty image content
  produces a guided empty state rather than broken media.
- **Verified** on east-london-ic via temporary Modern overrides: all five
  variants, URL-only and captioned rows, alt fallback, empty/malformed rows,
  captions, disabled lightbox, keyboard navigation/focus, surface/solid/gradient
  backgrounds, and 390px filmstrip scrolling with no page overflow. Config and
  dev.db restored. Production build clean. Repo-wide typecheck still reports
  only the pre-existing EditorPreview, SectionsTab, WidgetAnnouncementBar, and
  WidgetServices errors; no gallery errors.

### 12. Carousel (`widgets/carousel.ts`, `WidgetCarousel.vue`) — newest
Variants: **single-slide (hero, default/legacy) / multi-slide / cards / split /
minimal**. Props: `eyebrow` (default "Featured", was hardcoded), `accent`,
`background`, `align`, `slidesPerView` (1/2/3, gated to multi-slide+cards),
`imageRatio`, `showCta`, `showArrows`, `showDots`, `loop`, `autoplaySpeed`
(gated to autoplay on). Kept `title`, `subtitle`, `slides`, `variant`,
`autoplay`. **Prop-driven** (no DB, no migration). Slide rows now parse **5
columns** — `Title|Subtitle|Image URL|Link|Button label` (`parsePipeRows(slides,
5)`); old 3-col rows stay valid (no link → no button). `showCta` + a link
renders a per-slide CTA button across every variant.
- **Backward-compat is exact:** `single-slide` AND `multi-slide` both fall to the
  same hero-overlay `v-else` branch (the original full-bleed overlay `<article>`),
  differing only by `:ui.item` basis — so neither consuming template shifts.
  `cards`/`split`/`minimal` are the genuinely new looks. Adopted the shared
  accent/background system (copied from `WidgetGallery.vue`) — **`background`
  defaults to `surface`** (no wrapper; the overlay article keeps its own
  bg-primary) so legacy is pixel-preserved; `solid`/`gradient` wrap the section
  white-text.
- **No template edits needed** — **modern** already pins `variant:'single-slide'`
  and **fattan** pins `variant:'multi-slide'` (the only two consumers; both use
  the GLOBAL widget, no component override). classic/noor/sacred-modern ship no
  carousel section.
- **Verified** on birmingham-central via non-destructive PUT (temp
  `templateId:'modern'`, variants set via `sectionOverrides['carousel'].props`):
  cards+gradient+3-per-view renders 3 cards with `See times`/`Enrol` CTAs (3rd
  slide has no link → no button); split+solid renders image+text+CTA white-text;
  single/multi/minimal all render; 390px no overflow (`scrollW==clientW==390`);
  no console errors. Config restored to classic (no carousel override left).
  Build + carousel-filtered typecheck clean.

### 12b. Carousel — structured slide editor (editor-side, no widget render change)
Replaced the carousel's plain `slides` **textarea** with a Gallery-style
structured picker so non-technical admins manage slides as a stack instead of
editing pipe-delimited text.
- **New prop type `'slides'`** (`types/widget.ts`), wired in `PropField.vue`
  (`v-else-if field.type === 'slides'` → `CarouselSlidePicker`), exactly mirroring
  the existing `'images'` → `GalleryImagePicker` branch.
- **`app/components/editor/shared/CarouselSlidePicker.vue`** (NEW, auto-imported
  `pathPrefix:false`): a `vuedraggable` **vertical stack** — one row per slide
  (thumbnail + title + subtitle + drag-grip + edit pencil). `defineModel<string>`
  ⇄ the **5-column pipe string** `Title|Subtitle|Image URL|Link|Button label`
  (`parsePipeRows(model, 5)`), so it reads/writes the exact format
  `WidgetCarousel.vue` already parses — **the widget render is unchanged**.
  - **Click a row → Edit modal:** Title (required), Subtitle, Link, Button label,
    current image + a **Replace image** `UFileUpload` (uploads on save), and a
    **Remove** button.
  - **"Add a slide" → Add modal:** **Upload** + **Media library** tabs (same
    plumbing as Gallery), then Title/Subtitle/Link/Button fields. **Image is
    required** and **Title is required**; the slide title doubles as the image
    `alt` (no separate alt field — the renderer already does `:alt="item.title"`).
  - Uploads POST to the existing `/api/media/upload` with `tenantId` →
    `saveUploadBuffer` stores under `public/uploads/<tenantId>/…` (**tenant
    folder**) and registers a `MediaAsset`. **No backend/endpoint/migration
    change.**
- **`widgets/carousel.ts`:** `slides` prop type `textarea` → **`slides`**;
  `variant` moved into **`group: 'Style'`** and the Display block's first field
  carries **`groupDefaultOpen: false`** — so **Style and Display both start
  folded** (same accordion mechanism Gallery uses via `PropFieldGroups.vue`).
- **GOTCHA confirmed again:** adding the brand-new auto-imported
  `CarouselSlidePicker.vue` while `nuxt dev` was running needs a **dev-server
  restart** for the client manifest to resolve it (handoff #7).
- **Verified** in the live editor on birmingham-central (temp-switched to
  `modern` so the carousel section renders): slides show as a draggable stack;
  edit modal pre-fills + saves (title edit reflected in the row + live preview);
  "Add a slide" via the **Media library** tab appends a slide that renders in the
  preview; a real upload lands at `/uploads/<tenantId>/…`, is served 200, and
  appears in the library; Style + Display start collapsed (`chevron-right`); no
  console errors. **Cleanup:** config restored to classic, `prisma/dev.db`
  restored (`git checkout`) + dev server restarted so the test `MediaAsset`/file
  are gone (media count back to 0), test upload file deleted. Build + typecheck
  clean.

## NEXT UP: (none of the single-style queue remain)

All the global single-style widgets in this initiative are now upgraded
(prayer-times, prayer-countdown, jummah-times, services, events, announcements,
donation-cta, quick-links, about-mosque, contact, gallery, carousel) plus the
page-level announcement-bar. hero already shipped with multiple styles. If
picking up new work, apply the **exact same pattern** (see top of this file).

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
