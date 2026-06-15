# Website Editor Usage and Testing Guide

This guide covers the current Website Editor vertical slice in this workspace. It focuses on running the local app, using the editor, and verifying the implementation.

## Local Setup

Install dependencies:

```bash
npm install
```

Validate and generate the Prisma client:

```bash
npx prisma validate
npx prisma generate
```

Seed the local SQLite database:

```bash
npm run db:seed
```

The local database is expected at:

```text
prisma/dev.db
```

## Running the App

Use Nuxt preview with an absolute SQLite database URL:

```bash
DATABASE_URL="file:/Users/nasimhayath/Apps/msaas-ai/editor-codex/prisma/dev.db" npm run preview -- --port 3000
```

Open:

```text
http://localhost:3000
```

The normal dev server command exists:

```bash
npm run dev -- --port 3000
```

However, this environment has hit `EMFILE: too many open files, watch` while running Nuxt dev. Preview is currently the reliable local path.

## Seed Tenants

The seeded tenants are:

| Tenant | Public site | Editor |
| --- | --- | --- |
| Al-Noor Mosque | `/site/al-noor` | `/editor/al-noor` |
| East London Islamic Centre | `/site/east-london-ic` | `/editor/east-london-ic` |
| Birmingham Central Mosque | `/site/birmingham-central` | `/editor/birmingham-central` |

## Using the Editor

Open an editor route, for example:

```text
http://localhost:3000/editor/al-noor
```

The editor includes:

- A top bar with save controls and preview device controls.
- A left sidebar with `Theme`, `Sections`, and `Settings` tabs.
- A live website preview for the selected tenant.

### Theme Tab

Use the `Theme` tab to change:

- Template selection.
- Color palette.
- Font pair.

Click `Save` in the top bar to persist homepage configuration changes.

### Sections Tab

Use the `Sections` tab to:

- Reorder homepage sections with drag and drop.
- Toggle optional sections on or off.
- Edit section and widget content.

Rich text fields use Nuxt UI's `UEditor`, backed by Tiptap.

### Settings Tab

The `Settings` tab currently provides the editor scaffold for tenant settings such as domain and navigation. Full persistence for these settings is listed as a next step in `context.md`.

### Preview Devices

Use the device toggle in the top bar to inspect the live preview at desktop, tablet, and mobile widths.

## Public Site Review

Open a public tenant route, for example:

```text
http://localhost:3000/site/al-noor
```

Check that:

- The tenant header and footer render.
- Homepage sections render in the configured order.
- Prayer times, events, announcements, donations, and contact content appear.
- The page has no horizontal overflow on mobile widths.

## API Smoke Checks

Fetch a tenant homepage configuration:

```bash
curl http://localhost:3000/api/tenant/al-noor/config
```

Fetch tenant content:

```bash
curl http://localhost:3000/api/tenant/al-noor/prayer-times
curl http://localhost:3000/api/tenant/al-noor/events
curl http://localhost:3000/api/tenant/al-noor/announcements
curl http://localhost:3000/api/tenant/al-noor/donations
curl http://localhost:3000/api/tenant/al-noor/nav-items
```

Fetch registries:

```bash
curl http://localhost:3000/api/templates
curl http://localhost:3000/api/widgets
curl http://localhost:3000/api/theme/palettes
curl http://localhost:3000/api/theme/fonts
```

## Verification Commands

Run these before handing off changes:

```bash
npx prisma validate
npx prisma generate
npm run db:seed
npx nuxi typecheck
npm run build
```

Expected result:

- Prisma validation passes.
- Prisma client generation passes.
- Database seeding completes.
- Nuxt typecheck passes.
- Nuxt build passes.

The build may show Rollup pure annotation warnings from `@vueuse/core` and chunk size warnings from editor dependencies such as Tiptap. Those warnings are known for the current implementation.

## Browser Testing Checklist

Use the in-app browser or Playwright to verify:

- `/` loads and lists all three seeded tenants.
- `/site/al-noor` renders the public homepage.
- `/editor/al-noor` loads the editor shell.
- The editor shows `Theme`, `Sections`, and `Settings` tabs.
- The live preview renders tenant content inside the editor.
- Changing a palette and clicking `Save` shows a success toast.
- Reloading the editor keeps the saved homepage configuration.
- Mobile preview and a real narrow viewport do not show horizontal overflow.

## Known Local Notes

- Use an absolute `DATABASE_URL` for preview because Nuxt preview runs from `.output`.
- `npm run dev` may fail locally with watcher limits until the `EMFILE` issue is resolved.
- Prisma is pinned to v6 to preserve the datasource syntax used by the implementation plan.
- Manual SQLite migration application was used in this environment because Prisma schema-engine commands failed on `db push` and `migrate dev`.

