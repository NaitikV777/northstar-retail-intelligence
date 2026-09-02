# AI and automation plan

AI is a future product layer, not a requirement for reliable reorder rules. The first supplier alert should be deterministic, explainable, and easy to pause.

## Low-stock supplier notification

### Trigger

Evaluate when a trusted inventory event arrives and during scheduled reconciliation. A rule becomes eligible when sellable quantity is at or below its reorder threshold.

### Guardrails

- Require a configured supplier and verified destination.
- Lock by location and variant while evaluating.
- Use an idempotency key based on rule, inventory episode, and channel.
- Enforce a configurable cooldown.
- Skip if an open purchase order already covers the target.
- Default to owner approval; allow automatic sending only per explicit rule.
- Record the triggering stock, rule version, recipient, rendered message, and delivery result.
- Provide global pause and per-supplier pause controls.

### Message content

- Store and delivery location
- Product name, internal SKU, and supplier SKU
- Current stock and reorder threshold
- Suggested quantity and case-pack rounding
- Requested delivery date
- Owner contact and a stable reference number

## Future AI features

1. **Demand forecast:** estimate demand by product/location with seasonality, promotions, holidays, and uncertainty.
2. **Reorder recommendation:** combine forecast, lead time, safety stock, case packs, cost, and shelf capacity.
3. **Anomaly detection:** flag unusual sales, shrink, price changes, or data-sync gaps.
4. **Owner briefing:** summarize the largest changes with links back to source metrics.
5. **Natural-language analysis:** answer questions by generating constrained analytics queries and citing the exact time range and records used.

## AI safety requirements

- Predictions always show confidence/freshness and the inputs that materially affected them.
- AI text never silently sends an order or changes price/inventory.
- High-impact actions have deterministic validation after model output.
- Prompts and outputs must not contain unnecessary customer personal information.
- Model failures fall back to normal rules and never block inventory ingestion.

## Example rule lifecycle

```text
Inventory update → threshold matched → guardrails → draft message
     → owner approval (default) → send → delivery status → audit log
```
