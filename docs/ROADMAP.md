# Product roadmap

Northstar is intentionally built in milestones so that each phase can be validated with store owners before the next one begins.

## Milestone 1 — Owner dashboard (complete)

Goal: validate the information hierarchy and daily decision workflow.

- Overview KPIs and comparison charts
- Category revenue mix
- Product search and stock filter
- Individual product insight drawer
- Responsive, animated dashboard shell
- Realistic but clearly non-live demonstration data

Acceptance signal: an owner can find a risky product and understand why it needs attention in under one minute.

## Milestone 2 — Data foundation (in progress)

- Persistent stores, locations, products, suppliers, inventory snapshots, and sales — complete
- Provider-neutral external references and automation audit records — complete
- Database-backed dashboard read API and freshness state — complete
- User authentication and store membership
- CSV import for first-time setup
- Data freshness indicators and import error report
- Inventory adjustments with an audit log

## Milestone 3 — First POS connection

- Implement one provider adapter, recommended starting with Square
- OAuth connection flow and location mapping
- Initial product/catalog backfill
- Incremental order, refund, and inventory sync
- Webhook verification, replay protection, retries, and sync health panel

## Milestone 4 — Supplier alerts

- Per-product reorder points and preferred suppliers
- Email draft and approval workflow
- Optional automatic send for trusted rules
- Cooldowns, duplicate prevention, escalation, and delivery status
- Automation history and manual pause switch

## Milestone 5 — Analytics expansion

- Gross margin and contribution margin
- Basket analysis and frequently bought-together products
- Sell-through, days of supply, inventory turnover, shrink, and waste
- Hour/day/season heatmaps
- Location and cohort comparison
- Forecast-versus-actual reporting

## Milestone 6 — AI decision support

- Demand and stockout forecasting
- Natural-language business questions with cited underlying records
- Suggested reorder quantities with confidence ranges
- Promotion and price anomaly detection
- Weekly owner briefing with review-before-send controls

## Out of scope until validated

- Autonomous purchase orders without limits
- Replacing the POS as the system of record
- Financial accounting or tax filing
- Customer-level personalization without explicit consent and retention controls
