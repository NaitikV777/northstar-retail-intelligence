# GitHub issue backlog

These issues are ready to file after the repository is created. They intentionally follow the staged roadmap rather than starting every capability at once.

## 1. Milestone 2: persistent retail data foundation

**Labels:** `enhancement`, `milestone-2`, `data`

Create the provider-neutral persistence layer required before live POS data or supplier automations.

Acceptance criteria:

- Organization, location, product, variant, supplier, external reference, order, order line, inventory snapshot, and inventory movement records are represented.
- A migration creates the schema in a fresh database and upgrades an existing development database.
- Money uses integer minor units and every record carries the correct currency/location context.
- Timestamps are stored in UTC while each location retains its reporting time zone.
- Seed data reproduces the current dashboard demonstration.
- Read queries are covered by tests and enforce organization/location boundaries.

## 2. Milestone 2: CSV product and inventory import

**Labels:** `enhancement`, `milestone-2`, `import`

Give stores a provider-independent way to load product data before POS integration.

Acceptance criteria:

- An owner can upload a documented CSV template and preview parsed rows before importing.
- Required fields, duplicate SKUs/barcodes, currencies, quantities, and row-level errors are validated.
- Valid rows can be imported without accepting invalid rows accidentally.
- Re-importing the same file is idempotent.
- The import result reports created, updated, skipped, and failed rows.

## 3. Milestone 3: Square POS adapter and sync health

**Labels:** `enhancement`, `milestone-3`, `integration`

Implement the first POS adapter only after the data foundation is approved.

Acceptance criteria:

- OAuth requests only the permissions required for catalog, orders, refunds, locations, and inventory.
- Owners explicitly map Square locations to Northstar locations.
- Initial backfill and incremental webhooks normalize into the canonical model.
- Webhook signatures, duplicate events, pagination, rate limiting, late refunds, and retries are tested.
- A sync-health panel displays last success, current lag, and actionable failures.
- Disconnecting stops ingestion without deleting normalized history.

## 4. Milestone 4: low-stock supplier email workflow

**Labels:** `enhancement`, `milestone-4`, `automation`

Create a deterministic reorder notification workflow with owner approval as the default.

Acceptance criteria:

- Rules support location, variant, threshold, target quantity, supplier, cooldown, and approval mode.
- Eligible stock events create one draft per inventory episode using an idempotency key.
- Drafts include store, item/SKU, supplier SKU, stock level, suggested quantity, and desired date.
- An owner can edit, approve, cancel, pause, and inspect every run.
- Delivery status and provider response are recorded without exposing credentials.
- Repeated or out-of-order inventory events cannot send duplicate emails.

## 5. Milestone 5: margin, stock coverage, and basket analytics

**Labels:** `enhancement`, `milestone-5`, `analytics`

Expand analytics only after live transaction and inventory data are reliable.

Acceptance criteria:

- Gross margin, contribution margin, days of supply, sell-through, turnover, shrink, and waste follow the formulas in `docs/DATA_MODEL.md`.
- Each metric shows time range, comparison period, locations, currency, and last data refresh.
- Product details show sales, margin, stock, and reorder history over time.
- Basket analysis identifies frequently purchased product pairs with minimum-support controls.
- Empty, partial, stale, and multi-currency states do not produce misleading totals.

## 6. Milestone 6: explainable AI demand and reorder suggestions

**Labels:** `enhancement`, `milestone-6`, `ai`

Add AI decision support only after deterministic reorder behavior is stable.

Acceptance criteria:

- Forecasts show horizon, confidence range, freshness, and material inputs.
- Suggested quantities respect lead time, case pack, target service level, shelf capacity, and open orders.
- Recommendations never send messages or change inventory without deterministic validation and configured approval.
- Store owners can compare recommendation versus actual outcome and provide feedback.
- Model failure falls back to normal rules and never blocks POS ingestion.
- Evaluation fixtures cover seasonal, promotional, sparse-data, and stockout-censored demand.
