# Architecture

## Current state

Milestone 2 separates product storytelling from operational work. The `/` route is an immersive marketing experience with a single, isolated WebGL shader canvas. The `/dashboard` route stays lightweight and requests a typed, read-only dashboard endpoint; that endpoint uses prepared statements to query normalized store, product, inventory, reorder, and daily metric records. The interface shows whether data came from D1 and falls back to explicitly labelled demonstration values if the read service is unavailable.

```text
Browser
  ├── Landing page
  │   ├── isolated shader environment
  │   └── scroll-led product story
  └── Dashboard page (/dashboard)
      ├── KPI and chart views
      ├── product search/filter state
      ├── product detail drawer
      └── GET /api/dashboard
           └── prepared D1 queries
                ├── canonical retail records
                ├── latest inventory snapshots
                └── daily store/product metrics
```

No POS API, email provider, or AI service is called in the current release. Seeded D1 records are not presented as live POS data.

## Target architecture

```text
POS providers ──webhooks/polling──> Provider adapters
                                      │
                                      v
                              Normalization layer
                                      │
                         ┌────────────┴────────────┐
                         v                         v
                    Operational DB            Event queue
                         │                         │
                         v                         v
                  Analytics queries       Automation engine
                         │                         │
                         └────────────┬────────────┘
                                      v
                               Owner dashboard
                                      │
                              Email/SMS suppliers
```

## Module boundaries

- **Domain:** provider-neutral entities and business rules.
- **Connectors:** POS-specific authentication, pagination, webhooks, and field mapping.
- **Sync:** checkpoints, idempotency, retry policy, reconciliation, and freshness.
- **Analytics:** derived metrics with documented formulas and time zones.
- **Automation:** rule evaluation, approvals, cooldowns, notifications, and audit history.
- **Presentation:** role-aware dashboards, tables, product details, and configuration.

## Non-functional requirements

- Multi-location data isolation
- Idempotent inbound events and outbound notifications
- UTC storage with store-local reporting time zones
- Accessible keyboard and touch interfaces
- Observable sync status, failures, and data freshness
- Encryption in transit and at rest
- Least-privilege provider scopes and secret rotation
- Backups plus tested restore procedures

## Deployment

The project builds to Cloudflare-compatible ESM using vinext and the Sites Vite plugin. The production application uses the logical `DB` binding for D1; the platform resolves the deployment-specific database identifier. R2 remains out of scope until uploads are introduced.
