# POS integration plan

## Recommended first provider

Start with one POS provider after Milestone 2. Square is a practical first adapter for small retailers, but the provider should be confirmed with target users before implementation.

## Adapter contract

Each provider adapter should expose the same internal operations:

- connect and refresh authorization
- list merchant locations
- import catalog items and variants
- import orders, refunds, and payments
- read or receive inventory changes
- verify webhook signatures
- map provider records to canonical records
- report checkpoint, lag, and last error

## Connection flow

1. The owner chooses a provider and authorizes only required permissions.
2. Northstar retrieves available locations and asks the owner to map them.
3. A background import backfills catalog and recent history.
4. Webhooks trigger incremental synchronization.
5. Scheduled reconciliation catches missed or out-of-order events.
6. The dashboard displays last successful sync and degraded states.

## Reliability controls

- Store provider event IDs and reject duplicate processing.
- Use cursor checkpoints and bounded retry with dead-letter handling.
- Verify signatures before parsing webhook payloads.
- Make upserts and inventory movements idempotent.
- Respect provider rate limits and retry headers.
- Preserve the POS as source of truth until explicit write-back is enabled.
- Never display stale data as live; show a freshness timestamp.

## Testing strategy

- Contract tests against saved, redacted provider fixtures
- Signature and replay tests for webhooks
- Pagination and rate-limit tests
- Reconciliation tests for late refunds and catalog edits
- Sandbox end-to-end test from authorization through dashboard refresh
