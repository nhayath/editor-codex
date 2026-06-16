# Website Editor Implementation Context

## Current Scope

This workspace implements the Phase 6 homepage Website Editor vertical slice for the multi-tenant mosque website hosting SaaS. The work intentionally stays focused on the Editor, the public preview/rendering path it needs, and the supporting local data/API layer from the attached plan.

The implementation follows the plan structure without changing the planned product scope.

## Implemented

- Nuxt 4 app wrapper with `UApp`, Nuxt UI v4, app CSS variables, and root component auto-imports with `pathPrefix: false`.
- Prisma SQLite schema for users, tenants, settings, homepage config, prayer times, Jumu'ah times, events, announcements, donation campaigns, media assets, and nav items.
- TypeScript registries for:
  - templates: `classic`, `modern`, `fattan`, `noor`
  - widgets: all 16 planned widgets
  - theme palettes and font pairs
- Template-specific widget override resolution:
  - templates can override global widget metadata/components by stable widget id
  - `resolveWidgetDefinition` merges default widget schemas with template-specific prop schemas
  - resolved sections/widgets carry effective component, name, icon, prop schema, and merged default props for both rendering and editor panels
  - renderers use a component resolver that tries the template component first and falls back to the global widget component
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
- Mobile hero preview fix verified in the in-app Chrome/browser QA loop:
  - The hero uses container-aware Nuxt UI `UPageHero` overrides so the embedded editor preview responds to preview width instead of the full browser viewport.
  - In editor Mobile preview mode, the hero title stays inside the card, the image stacks below the title, and no hero horizontal overflow was observed.
- Mobile grouped-section preview fix verified in the in-app Chrome/browser QA loop:
  - `GroupRenderer` uses container queries for row layouts so embedded editor Mobile preview stacks grouped widgets instead of using the full browser viewport breakpoint.
  - The Prayer & Jumu'ah group stacks its countdown and Jumu'ah cards vertically in Mobile preview, with no horizontal overflow observed.
- Mobile announcements preview fix verified in the in-app Chrome/browser QA loop:
  - `WidgetAnnouncements` uses container queries so announcement cards stack vertically in embedded editor Mobile preview.
  - The announcements section showed full-width cards, no horizontal overflow, and no relevant console errors.
- Mobile events preview fix verified in the in-app Chrome/browser QA loop:
  - `WidgetEvents` uses container queries so event cards stack vertically in embedded editor Mobile preview.
  - The events section showed full-width cards, no horizontal overflow, and no relevant console errors.
- Mobile tenant header/menu fix verified in the in-app Chrome/browser QA loop:
  - `TenantHeader` uses container queries so the embedded editor Mobile preview hides desktop nav/CTA controls and shows a compact menu button.
  - Opening the mobile menu shows the tenant navigation links in a stacked menu with no horizontal overflow and no relevant console errors.
- Mobile responsive sweep verified in the in-app Chrome/browser QA loop:
  - Donation, about, contact, footer, prayer times, services, gallery, carousel, location map, and related remaining public widgets use container-aware breakpoints where they appear inside the embedded editor preview.
  - Classic and modern seeded tenants were checked in editor Mobile preview; key cards/columns stack at 390px with no horizontal overflow and no relevant console errors.
- Fattan-style template variation added and verified in the in-app Chrome/browser QA loop:
  - New `fattan` template registered with a warm plum/gold editorial mosque layout inspired by the provided reference HTML.
  - Added `Plum & Gold` palette, template default palette/font support, and a `/templates/fattan.svg` thumbnail.
  - `tenant-site` now exposes `data-template`, allowing the Fattan template to use scoped shell styling without leaking to Classic/Modern.
  - Editor Theme tab selection was tested by selecting `Fattan` from `/editor/al-noor`.
  - Mobile preview at 390px and tablet preview at 768px both rendered all 8 Fattan sections with no horizontal overflow and no relevant console errors.
  - Mobile menu interaction was tested after the header breakpoint was raised so tablet/mobile previews keep the compact menu instead of truncating the mosque name.
  - Screenshot evidence saved at `/private/tmp/fattan-template-mobile.png` and `/private/tmp/fattan-template-tablet.png`.
- Prayer Times feature-panel style added and verified in the in-app Chrome/browser QA loop:
  - The Fattan template now overrides the global `prayer-times` widget with `FattanPrayerTimes`, a plum/gold panel with highlighted next-prayer card, mosque-image wash, skyline footer treatment, and the original Fattan prayer icons.
  - The global `WidgetPrayerTimes` remains generic (`table`, `cards`, `compact`), while Fattan exposes the template-only `Feature panel` style plus `hijriDate` and `backgroundImageUrl` props through the editor.
  - The Fattan template uses the override for its required Prayer Times section.
  - Editor QA selected Fattan on `/editor/al-noor` without persisting the tenant config, then checked desktop, mobile, and tablet preview widths.
  - Browser metrics confirmed 5 prayer cards, expected icon tokens, no card overflow, no root horizontal overflow, and no relevant console errors.
  - Screenshot evidence saved at `/private/tmp/prayer-feature-desktop-focused.png`, `/private/tmp/prayer-feature-mobile-focused.png`, and `/private/tmp/prayer-feature-tablet-focused.png`.
  - Public `/site/al-noor` was also checked after the tenant was on Fattan: desktop and 390px mobile renders showed the feature panel with no root/card overflow and no relevant console errors.
  - Public screenshot evidence saved at `/private/tmp/prayer-feature-public-site.png`, `/private/tmp/prayer-feature-public-mobile.png`, and `/private/tmp/prayer-feature-public-mobile-full.png`.
- Template-specific widget override system added and verified:
  - `TemplateDefinition.widgets` lets templates override global widget metadata/components by stable widget id while preserving existing homepage config JSON.
  - `resolveWidgetDefinition` merges global and template prop schemas by key; template schema entries replace same-key fields and append extra fields.
  - `resolveSections` now returns effective widget component/name/icon/prop schema for single widgets and group widgets, so renderers and editor panels use the same override/fallback result.
  - `SectionRenderer` and `GroupRenderer` use `resolveWidgetComponent`, which tries the resolved component first and falls back to the global widget component by base widget id.
  - `GroupEditor` now reads resolved widget metadata directly instead of the global widget registry, exposing template-only props in grouped widgets as well.
  - Fattan `prayer-times` override resolves to `FattanPrayerTimes`; Classic still resolves to global `WidgetPrayerTimes`.
  - Resolver smoke check confirmed Fattan prop keys: `variant`, `title`, `showIqamah`, `showSunrise`, `hijriDate`, `backgroundImageUrl`.
  - Typecheck and build passed after the architecture change.
  - Browser QA verified `/editor/al-noor` template switch Classic -> Fattan, Fattan-only `Hijri date` editor field live-updating the preview, `/site/al-noor` public rendering, and public mobile/tablet overflow checks with no relevant console errors.
  - Screenshot evidence saved at `/private/tmp/template-override-editor-desktop.png`, `/private/tmp/template-override-editor-panel.png`, `/private/tmp/template-override-editor-switch.png`, `/private/tmp/template-override-public-desktop.png`, `/private/tmp/template-override-public-mobile.png`, and `/private/tmp/template-override-public-tablet.png`.

## QA Workflow Note

For future editor/UI changes, run E2E-style rendered QA with Chrome DevTools MCP or the available in-app Chrome/browser tooling before handoff. This is now part of the project guideline, also documented in `docs/usage-and-testing-guide.md`.

Minimum QA evidence:

- Route identity and expected tenant/template are loaded.
- Page is non-blank and has no framework error overlay.
- Browser console has no relevant errors or warnings.
- At least one real interaction related to the changed flow is exercised.
- Screenshot evidence is captured for affected desktop/mobile/tablet states when layout changes.
- Mobile and tablet widths are checked for horizontal overflow and clipped text.

## Next Steps

- Resolve the local Nuxt dev watcher `EMFILE` issue so `npm run dev` works normally.
- Decide whether to keep the manual SQLite migration application workflow or revisit Prisma migrate/db push in the target development environment.
- Add persistence for Settings tab domain/nav edits if that remains in scope for the editor phase.
- Add auth/session checks around editor APIs once the simplified auth layer is implemented.
- Add focused automated tests for config normalization, required-section enforcement, and config PUT/GET round trips.
- Improve bundle size by lazy-loading editor-only controls such as Tiptap and draggable components.
- Replace placeholder SVG media with production mosque imagery or generated bitmap assets before product-facing review.
- Consider whether the Fattan template should get production-specific imagery and richer lecture/newsletter widgets if those become part of the editor scope.
- Add more template-specific overrides, starting with Fattan/Noor hero, donation, footer, and grouped-feature widgets, if distinct template identity remains a priority.
