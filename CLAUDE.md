# CLAUDE.md

Guidance for working in this repository. Read this before making changes.

## What this is

A **multi-tenant mosque website hosting SaaS** — Phase 6 vertical slice: a
Shopify-style **homepage Website Editor**, the public site rendering path it
feeds, and the local data/API layer behind both. Each tenant picks a
**template**, arranges **sections**, and each section renders one or more
**widgets** whose props are edited live.

## Stack

- **Nuxt 4** (`app/` dir structure), **Vue 3** SFCs (`<script setup lang="ts">`), TypeScript
- **Nuxt UI v4** components (`U*`), **Tailwind CSS v4** with container queries
- **Prisma 6** + **SQLite** (`prisma/dev.db`). Pinned to v6 — Prisma 7 rejects the `url = env("DATABASE_URL")` datasource syntax.
- **Tiptap** for rich-text props, **vuedraggable** for the section list
- Theming via CSS variables: `--color-primary`, `--color-secondary`, `--color-text`, `--color-text-muted`, `--color-surface`. Use `color-mix(in srgb, …)` for tints/hairlines.

## Commands

```bash
npm run build          # nuxt build → .output
npm run preview        # serves .output (needs DATABASE_URL, see below)
npm run dev            # nuxt dev (may hit EMFILE: too many open files here)
npm run db:push        # prisma db push
npm run db:seed        # seed 3 tenants (jiti prisma/seed.ts)
npx vue-tsc --noEmit   # typecheck
```

Preview serves a prebuilt `.output` and can't inject env vars, so use an
**absolute** SQLite URL:

```bash
DATABASE_URL="file:/Users/nasimhayath/Apps/msaas-ai/editor-codex/prisma/dev.db" npm run preview -- --port 3000
```

Sanity check: `/` AND `/api/tenant/<slug>/config` should both be 200. If config
is 500, the env var didn't apply.

## Architecture

### Registries (plain TS, not components)
- `widgets/*.ts` — global widget definitions (`WidgetDefinition`), aggregated in `widgets/index.ts`. ~16 widgets (hero, prayer-times, prayer-countdown, jummah-times, events, announcements, donation-cta, gallery, carousel, services, about-mosque, contact, location-map, quick-links, rich-text, image, text).
- `templates/*.ts` — `TemplateDefinition`s (classic, modern, fattan, noor, sacred-modern), aggregated in `templates/index.ts`. `getTemplateDefinition(id)` falls back to classic.
- `types/widget.ts`, `types/template.ts`, `types/theme.ts`, `types/editor.ts` — the contracts. Read these first.

### Template-aware widget overrides (the core mechanism)
Templates can override a global widget **by stable widget id** via
`TemplateDefinition.widgets: Record<widgetId, TemplateWidgetOverride>`.
Resolution lives in `utils/homepage.ts`:
- `resolveWidgetDefinition(template, widgetId)` — merges global + template prop schemas **by key** (template entries replace same-key fields, extra fields append).
- `resolveSections(template, draft)` — returns `ResolvedSection[]` carrying the **effective** component / name / icon / merged prop schema / resolved props, used by BOTH renderers and editor panels.
- Renderers (`SectionRenderer`, `GroupRenderer`) use a resolver that tries the template component first, falls back to the global widget component by base id.
- Example: `sacred-modern` ships its own `SacredModernPrayerTimes`; `fattan` overrides prayer-times with `FattanPrayerTimes` (variant `feature-panel`); classic/modern use the global `WidgetPrayerTimes`.

Template-specific components live under `app/components/templates/<template>/{chrome,widgets}/`.

### Widget prop schema
`WidgetPropSchema`: `key`, `label`, `type` (text/textarea/richtext/number/toggle/select/color/image/url/icon), optional `group` (collapsible accordion), `span: 'full'|'half'` (half pairs side-by-side), `default`, `options`, `showWhen`.
- `showWhen`: single `{key,value}` (value may be array = "is one of"), OR array of conditions = OR.

### Config persistence
- Config shape is `HomepageConfigDraft` (templateId, paletteId, fontPairId, sectionOrder, sectionsEnabled, sectionOverrides).
- **`PUT /api/tenant/<slug>/config` takes the draft DIRECTLY as the body** — NOT wrapped in `{ config }`. Wrapping silently no-ops.
- `sectionOverrides[id].props` (and `.groupProps`, `.widgets[slot].props`) hold per-tenant prop edits.

### Editor (IMPORTANT — there are decoys)
- **The live editor is `app/components/editor/tabs/SectionsTab.vue`**, which renders prop-editing panels inline.
- `app/components/editor/panels/SectionEditor.vue` and `GroupEditor.vue` are **legacy/unused decoys** — editing them does nothing. Grep `app/` to confirm a render path before touching.
- Prop fields render via `app/components/editor/panels/PropFieldGroups.vue` → `PropField.vue`. Ungrouped fields go in a top 2-col grid; grouped fields go in collapsible accordions (first open, rest collapsed).
- Composables: `useHomepageEditor`, `useTenantData`, `useTemplateRegistry`, `useWidgetRegistry`, `useTheme`.

### Public rendering
`app/pages/site/[slug].vue` → `TenantHeader` / `SectionRenderer` / `GroupRenderer` / `TenantFooter`. Editor lives at `app/pages/editor/[slug].vue`.

## Seeded tenants (pick per what you're testing)
- `birmingham-central` = **classic** (global widgets, no overrides — best for testing global widgets/hero)
- `east-london-ic` = **modern**
- `al-noor` = **sacred-modern** (overrides hero + others)

## Conventions & gotchas
- **Container queries:** `@xl:` etc. resolve against an **ancestor** marked `@container`, never the element itself. Put `@container` on a wrapper, the `@xl:` utilities on a child. All widgets must stack cleanly at 390px (no horizontal overflow) inside the embedded editor preview.
- **Typecheck has known pre-existing errors** in `EditorPreview.vue` and `SectionsTab.vue` (≈lines 27/31) unrelated to changes — filter them out (`git stash` to confirm).
- Match surrounding code style; widgets are theme-variable driven, not hardcoded colors.

## QA workflow (do this before handoff for UI changes)
1. **Rebuild before QA** — source edits are NOT live under `preview` (serves `.output`). `npm run build`, then restart preview. (`dev` serves source live, but is flaky here.)
2. Prefer the **Claude_Preview MCP** (`preview_eval`/`preview_screenshot`/`preview_console_logs`); the Chrome extension MCP is often "not connected".
3. Nuxt UI tabs are `button[role=tab]` — synthetic `.click()` does NOT switch them; dispatch full pointerdown→mousedown→pointerup→mouseup→click.
4. **Non-destructive render testing:** GET `/api/tenant/<slug>/config`, save it, PUT a modified draft, curl `/site/<slug>` and grep markers, then **PUT the original back. Always restore.**
5. Evidence: route/tenant correct, no error overlay, no relevant console errors, one real interaction exercised, screenshots for desktop/mobile/tablet when layout changes.

## Docs
- `docs/template-authoring-guide.md` — how to author templates, single/group sections, template-only widgets, schema extension.
- `docs/usage-and-testing-guide.md` — local usage + testing workflow.
- `context.md` — detailed implementation history of the Phase 6 slice.
