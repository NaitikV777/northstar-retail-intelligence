# Architecture

## Current state

Milestone 1 is a client-rendered React dashboard. The data fixtures and interactions live in `app/page.tsx`; the visual system, layout, responsive rules, and motion live in `app/globals.css`. This keeps the prototype easy to inspect while the product language is still being validated.

```text
Browser
  └── Dashboard page
      ├── KPI and chart views
      ├── product search/filter state
      └── product detail drawer
           └── in-memory demonstration products
```

No database, POS API, email provider, or AI service is called in the current release.

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

The project builds to Cloudflare-compatible ESM using vinext and the Sites Vite plugin. D1 and R2 bindings are currently unset in `.openai/hosting.json`; they should be introduced only when persistent records or uploads enter scope.
