# Northstar Retail Intelligence

Northstar is an analytics workspace for convenience stores and grocery chains. It gives an owner a fast view of sales, orders, category performance, stock risk, and individual product health without requiring a spreadsheet.

> **Project status:** Milestone 1 — interactive product and inventory dashboard. POS sync, live persistence, supplier messaging, and predictive AI are deliberately planned for later milestones.

## Current release

- Daily KPI cards for net sales, orders, average order value, and low-stock items
- Animated sales comparison chart with 7, 30, and 90-day views
- Sales mix by product category
- Searchable product performance table
- Low-stock filter and inventory status indicators
- Click-through product detail drawer with stock coverage and product-level insight
- Responsive layout, keyboard-accessible rows, and reduced-motion support
- Clearly labelled AI preview without pretending to run a live model

All data in this release is realistic demonstration data stored in the page component. No supplier message is sent and no POS account is connected.

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. For a production check:

```bash
npm run build
npm test
```

## Documentation

- [Product roadmap](docs/ROADMAP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Data model](docs/DATA_MODEL.md)
- [Analytics and visualization catalog](docs/ANALYTICS_CATALOG.md)
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
- vinext on Vite for a Cloudflare-compatible application build
- Tailwind CSS tooling with a custom responsive design system
- Cloudflare D1/Drizzle-ready starter structure (not enabled in Milestone 1)

## Repository structure

```text
app/                 Dashboard UI and global design system
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
