# Data model

This is the planned canonical model. It prevents every POS provider from leaking its own field names into analytics and automation rules.

## Core entities

| Entity | Purpose | Important fields |
|---|---|---|
| Organization | Business account | id, name, default currency |
| Location | Physical store | organization id, name, address, time zone |
| Product | Sellable business item | id, name, brand, category, tax class |
| Variant | SKU-level item | product id, sku, barcode, price, cost |
| Supplier | Vendor contact | name, email, phone, ordering policy |
| SupplierItem | Supplier-specific listing | supplier id, variant id, vendor sku, case pack, lead time |
| InventorySnapshot | Quantity at a moment | location id, variant id, on hand, reserved, captured at |
| InventoryMovement | Auditable stock change | variant id, quantity delta, reason, source id |
| Order | Completed/updated transaction | provider id, location id, totals, status, occurred at |
| OrderLine | Item sold in an order | order id, variant id, quantity, price, discount, cost |
| ReorderRule | Alert policy | variant/location, threshold, target stock, cooldown, approval mode |
| AutomationRun | One rule execution | rule id, trigger, status, timestamps, dedupe key |
| Notification | Outbound supplier contact | run id, channel, recipient, content hash, delivery status |
| ExternalReference | Provider mapping | provider, external id, entity type, internal id |

## Metric definitions

- **Net sales:** gross item sales minus discounts and refunds; excludes tax and tips.
- **Average order value:** net sales divided by completed non-zero orders.
- **Gross margin:** net sales minus estimated cost of goods sold.
- **Sell-through:** units sold divided by units received during the selected period.
- **Days of supply:** sellable units on hand divided by average daily units sold.
- **Inventory turnover:** cost of goods sold divided by average inventory value.
- **Stockout:** sellable on-hand quantity at or below zero.

Every aggregate must retain location, currency, source, store time zone, and freshness metadata. Product variants—not display products—are the inventory unit of record.

## Data retention

- Keep raw provider payloads only as long as needed for debugging and reconciliation.
- Keep normalized transactions according to the business retention policy.
- Separate customer-identifying fields from aggregate analytics.
- Store automation consent, edits, approvals, and sends as an immutable audit trail.
