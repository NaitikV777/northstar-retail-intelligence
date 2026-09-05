# Northstar Retail Intelligence

Northstar is an analytics workspace for convenience stores and grocery chains. It gives an owner a fast view of sales, orders, category performance, stock risk, and individual product health without requiring a spreadsheet.

> **Project status:** Milestone 2 — an immersive product experience now leads into an interactive dashboard backed by a durable retail data foundation. CSV import, POS sync, supplier messaging, and predictive AI remain deliberately staged for later increments.

## Current release

- Immersive marketing landing page with one continuous WebGL gradient environment from hero to footer
- Scroll-led story that explains the path from sale to stock signal to owner action
- Metallic Northstar identity, expressive typography, glass surfaces, and reduced-motion support
- Dedicated `/dashboard` workspace kept separate from the heavier landing-page visuals
- Daily KPI cards for net sales, orders, average order value, and low-stock items
- Animated sales comparison chart with 7, 30, and 90-day views
- Sales mix by product category
- Searchable product performance table
- Low-stock filter and inventory status indicators
- Click-through product detail drawer with stock coverage and product-level insight
- Responsive layout, keyboard-accessible rows, and reduced-motion support
- Aurora gradient interface with Syne display typography, glass surfaces, and progressive scroll motion
- Clearly labelled AI preview without pretending to run a live model
- D1-backed canonical schema for stores, products, variants, sales, inventory, suppliers, provider mappings, and automation audit records
- Typed dashboard API with prepared queries, explicit freshness metadata, and a safe demonstration-data fallback

The deployed release uses realistic seeded demonstration records in D1. The page retains a clearly labelled fallback only when the database is unavailable. No supplier message is sent and no POS account is connected.

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run db:local
npm run dev
```

Open `http://localhost:3000` for the landing page or `http://localhost:3000/dashboard` for the working analytics interface. For a production check:

```bash
npm run build
npm test
```

`npm run db:local` builds the current worker and applies the idempotent demonstration migration to the project-local D1 database. Re-run it whenever the migration changes.

## Documentation

- [Product roadmap](docs/ROADMAP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Data model](docs/DATA_MODEL.md)
- [Analytics and visualization catalog](docs/ANALYTICS_CATALOG.md)
- [Visual system](docs/DESIGN_SYSTEM.md)
- [POS integration plan](docs/POS_INTEGRATIONS.md)
- [AI and automation plan](docs/AI_AUTOMATIONS.md)
- [Ready-to-file issue backlog](docs/ISSUE_BACKLOG.md)
- [Contributing guide](CONTRIBUTING.md)

## Product principles

1. **Action before decoration.** Every number should help an owner decide what to do next.
2. **Truthful states.** Preview data and future capabilities are explicitly labelled.
3. **Incremental delivery.** Each milestone is usable on its own.
4. **Provider-neutral core.** POS and messaging vendors connect through adapters rather than controlling the domain model.
5. **Human control.** Automated orders and supplier messages require configurable thresholds, audit logs, and approval rules.

## Technology

- React 19 and TypeScript
- React Three Fiber, Three.js, and ShaderGradient for the landing-page environment
- vinext on Vite for a Cloudflare-compatible application build
- Tailwind CSS tooling with a custom responsive design system
- Cloudflare D1 persistence with a Drizzle-managed relational schema and tested migrations

## Repository structure

```text
app/                 Landing page, dashboard UI, and global design system
docs/                Product and engineering documentation
public/              Static assets
tests/               Rendered-output checks
worker/              Cloudflare worker entry points
.openai/hosting.json Sites hosting configuration
```

## Security note

Never commit POS credentials, supplier API keys, or email provider secrets. Future connectors must use encrypted hosted secrets, narrow OAuth permissions, signed webhooks, idempotency keys, and an auditable event log.

## License

No open-source license has been selected yet. Until one is added, all rights are reserved.
