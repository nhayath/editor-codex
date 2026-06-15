# Website Editor Implementation Context

## Current Scope

This workspace implements the Phase 6 homepage Website Editor vertical slice for the multi-tenant mosque website hosting SaaS. The work intentionally stays focused on the Editor, the public preview/rendering path it needs, and the supporting local data/API layer from the attached plan.

The implementation follows the plan structure without changing the planned product scope.

## Implemented

- Nuxt 4 app wrapper with `UApp`, Nuxt UI v4, app CSS variables, and root component auto-imports with `pathPrefix: false`.
- Prisma SQLite schema for users, tenants, settings, homepage config, prayer times, Jumu'ah times, events, announcements, donation campaigns, media assets, and nav items.
- TypeScript registries for:
  - templates: `classic`, `modern`
  - widgets: all 16 planned widgets
  - theme palettes and font pairs
- Seed data for the 3 planned tenants:
  - `al-noor`
  - `east-london-ic`
  - `birmingham-central`
- API endpoints for tenants, config GET/PUT, tenant content, templates, widgets, theme, and media upload/list.
- Editor composables:
  - `useHomepageEditor`
  - `useTenantData`
  - `useTemplateRegistry`
  - `useWidgetRegistry`
  - `useTheme`
- Public tenant rendering path:
  - `TenantHeader`
  - `TenantFooter`
  - `SectionRenderer`
  - `GroupRenderer`
  - all widget components
- Editor UI:
  - full-screen editor layout/page
  - top bar with save and device toggle
  - Shopify-style sidebar with Theme, Sections, Settings tabs
  - draggable section list using `vuedraggable`
  - dynamic prop editor with Nuxt UI inputs and `UEditor` for rich text
  - live inline preview with desktop/tablet/mobile widths
- Dev landing page with tenant cards and Site/Editor links.

## Important Runtime Notes

- Prisma was pinned to v6 because Prisma 7 rejects the plan's `url = env("DATABASE_URL")` datasource syntax. This keeps the plan's schema shape intact.
- `npx prisma validate` and `npx prisma generate` work.
- In this environment, Prisma's schema engine failed on `db push`/`migrate dev` with an empty schema-engine error, so the migration SQL was generated from Prisma diff and applied with SQLite CLI.
- Local database file: `prisma/dev.db`.
- For Nuxt preview, use an absolute SQLite URL because preview runs from `.output`:

```bash
DATABASE_URL="file:/Users/nasimhayath/Apps/msaas-ai/editor-codex/prisma/dev.db" npm run preview -- --port 3000
```

- `npm run dev -- --port 3000` hit `EMFILE: too many open files, watch` in this environment. Preview is currently the reliable local server path.

## Verified

Commands run successfully:

```bash
npx prisma validate
npx prisma generate
npm run db:seed
npx nuxi typecheck
npm run build
```

Browser checks performed against `http://localhost:3000`:

- Landing page loads and lists all three tenants.
- `/site/al-noor` renders all 8 classic sections.
- Public mobile check at 390px width shows 8 sections, no horizontal overflow, and desktop nav hidden.
- `/editor/al-noor` loads the editor shell, Theme/Sections/Settings tabs, live preview, and Save button.
- UI save cycle tested by changing palette to Midnight Blue, saving, verifying API returned `midnight`, then restoring `emerald`.
- Editor live preview scroll fix verified in the in-app Chrome/browser QA loop:
  - Desktop preview pane scrolls independently while the editor shell/body stays fixed.
  - Editor Mobile preview mode scrolls independently while the editor shell/body stays fixed.
  - No relevant browser console errors or warnings were observed during the scroll QA pass.

## QA Workflow Note

For future editor/UI changes, run E2E-style rendered QA with the Chrome DevTools MCP or the available in-app Chrome/browser tooling. At minimum, verify page identity, non-blank render, absence of framework overlays, console health, screenshot evidence, and one real interaction proof for the changed flow.

## Next Steps

- Resolve the local Nuxt dev watcher `EMFILE` issue so `npm run dev` works normally.
- Decide whether to keep the manual SQLite migration application workflow or revisit Prisma migrate/db push in the target development environment.
- Add persistence for Settings tab domain/nav edits if that remains in scope for the editor phase.
- Add auth/session checks around editor APIs once the simplified auth layer is implemented.
- Add focused automated tests for config normalization, required-section enforcement, and config PUT/GET round trips.
- Improve bundle size by lazy-loading editor-only controls such as Tiptap and draggable components.
- Replace placeholder SVG media with production mosque imagery or generated bitmap assets before product-facing review.
