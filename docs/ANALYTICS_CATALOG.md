# Analytics and visualization catalog

This catalog defines the full analytical direction for Northstar. It is intentionally broader than the current interface and should be delivered incrementally as reliable data becomes available.

The rule for every chart is simple: it must answer a store-owner question and expose its time range, comparison, location, currency, and data freshness. A graph is not added only to increase visual variety.

## Global analysis controls

Every analytical page should eventually share these controls:

- Date range and comparison period
- Organization, location, region, and store format
- Product, variant, category, brand, and supplier
- Sales channel and fulfillment type
- Promotion, tax, and discount state
- Hour, day of week, week, month, quarter, and season
- Currency and store-local time zone
- Data freshness and source status

Filters should cross-highlight related charts and remain encoded in shareable URLs. Exported values must carry the same filter and metric definitions as the screen.

## Executive overview

| Owner question | Metric or analysis | Recommended visual | Milestone |
|---|---|---|---|
| How is the business performing now? | Net sales, orders, average order value, units, gross margin | KPI cards with comparison sparklines | 1 and 5 |
| Are we ahead or behind the previous period? | Current versus prior sales and margin | Grouped bars or dual line chart | 1 and 5 |
| What caused the change in profit? | Revenue, discount, refund, COGS, waste, and shrink effects | Waterfall chart | 5 |
| Which areas deserve attention first? | Ranked positive and negative metric movements | Exception table with magnitude bars | 5 |
| Are we on track against a target? | Actual versus budget/forecast | Bullet chart; avoid decorative speedometer gauges | 5 |

## Sales and demand

| Owner question | Metric or analysis | Recommended visual | Milestone |
|---|---|---|---|
| How are sales changing over time? | Net sales, units, and orders by interval | Line or area chart | 1 and 5 |
| When are the busiest periods? | Sales/orders by weekday and hour | Calendar or hour-by-day heatmap | 5 |
| Which categories drive revenue? | Category and subcategory contribution | Ranked bar, stacked bar, or treemap | 1 and 5 |
| Is growth broad or concentrated? | Contribution to growth by category/product | Diverging bar or waterfall | 5 |
| What is the distribution of basket values? | Order value frequency and percentile | Histogram with median and percentile markers | 5 |
| How volatile is demand? | Daily unit distribution by product/category | Box plot | 5 |
| Are price and volume moving together? | Unit price versus units sold | Scatter plot with trend line | 5 |
| Which items combine scale, growth, and margin? | Revenue, growth, and margin | Bubble chart | 5 |
| What is likely to happen next? | Forecast and uncertainty by interval | Forecast line with confidence band | 6 |

### Sales metric definitions

- **Gross item sales:** sum of item price multiplied by quantity before discounts, refunds, tax, and tips.
- **Net sales:** gross item sales minus item/order discounts and refunds; excludes tax and tips.
- **Average order value:** net sales divided by completed non-zero orders.
- **Units per transaction:** units sold divided by completed orders.
- **Sales growth:** `(current net sales - comparison net sales) / comparison net sales`.
- **Like-for-like growth:** growth only across locations open for the complete current and comparison periods.

Canceled orders must not count as demand. Refunded quantities and refund timing need a documented reporting policy rather than silently changing historical totals.

## Product performance

| Owner question | Metric or analysis | Recommended visual | Milestone |
|---|---|---|---|
| Which products are strongest or weakest? | Revenue, units, margin, growth, and rank | Sortable table with in-cell bars | 1 and 5 |
| What changed for one product? | Sales, price, margin, and inventory history | Small-multiple time series | 1 and 5 |
| Which few products create most sales? | Cumulative revenue by ranked product | Pareto chart | 5 |
| How is the assortment structured? | Product count or revenue by category hierarchy | Treemap or sunburst | 5 |
| Which products behave similarly? | Demand, margin, velocity, and seasonality clusters | Scatter/bubble plot with segment labels | 6 |
| Which products are purchased together? | Pair support, confidence, and lift | Ranked association table plus network view | 5 |
| What do customers buy after entering a category? | Category-to-category basket flow | Sankey diagram, only for sufficiently large samples | 5 |

### Product detail requirements

Every product/variant detail page should include:

- Current price, cost, gross margin, on-hand, reserved, available, reorder point, and days of supply
- Sales, units, margin, and inventory time series
- Location comparison
- Promotion and price-change annotations
- Supplier, case pack, lead time, open orders, and recent receipts
- Stockout, waste, shrink, and adjustment history
- Frequently bought-together products
- Forecast and reorder suggestion only when its quality threshold is met
- Direct links to the source transactions, inventory movements, and automation runs behind a claim

## Inventory and replenishment

| Owner question | Metric or analysis | Recommended visual | Milestone |
|---|---|---|---|
| What is at risk right now? | Stockout and below-threshold items | Prioritized exception table | 1 and 4 |
| How long will stock last? | Days of supply versus lead time | Bullet chart or risk bands | 4 and 5 |
| Is inventory healthy across categories? | Healthy, low, excess, and out-of-stock value | 100% stacked bar | 5 |
| How quickly does stock move? | Inventory turnover and sell-through | Ranked bars with target marker | 5 |
| Where is capital trapped? | Inventory value versus sales velocity | Quadrant scatter plot | 5 |
| Are stockouts hurting revenue? | Stockout duration and estimated missed sales | Timeline plus ranked bar | 5 and 6 |
| How does inventory age? | Days since receipt by value/units | Aging histogram | 5 |
| What moved inventory? | Receipts, sales, returns, waste, shrink, adjustments | Inventory movement waterfall | 5 |
| When will orders arrive? | Purchase order and expected receipt schedule | Compact timeline/Gantt view | 4 |

### Inventory metric definitions

- **Sellable on hand:** physical on hand minus reserved and unavailable quantities.
- **Days of supply:** sellable on hand divided by average forecast or trailing daily unit demand.
- **Sell-through:** units sold divided by units available for sale during the period; the exact receipt-window policy must be displayed.
- **Inventory turnover:** cost of goods sold divided by average inventory cost value.
- **Stockout rate:** time a sellable item is unavailable divided by eligible selling time.
- **Waste rate:** waste quantity or cost divided by received quantity or cost.
- **Shrink:** unexplained inventory loss after known sales, receipts, returns, transfers, and adjustments.

Negative inventory, missing costs, late events, and inventory-count corrections must be visible data-quality states rather than silently coerced to zero.

## Profitability and pricing

| Owner question | Metric or analysis | Recommended visual | Milestone |
|---|---|---|---|
| Which products create profit? | Gross margin dollars and percentage | Ranked bars and margin/revenue scatter | 5 |
| Where is discounting eroding margin? | Discount rate versus margin and volume | Scatter plot | 5 |
| How did price changes affect results? | Price, units, sales, and margin before/after | Indexed line chart with event annotation | 5 |
| Which categories subsidize others? | Category contribution margin | Waterfall or diverging bar | 5 |
| What is the price distribution? | Variant prices by category | Box plot or histogram | 5 |

Gross margin uses the cost effective when each unit was sold. If only the latest cost is known, the UI must label the result as estimated.

## Customers and baskets

Customer analytics should use anonymized or consented identifiers and should not be enabled merely because the POS exposes personal information.

| Owner question | Metric or analysis | Recommended visual | Milestone |
|---|---|---|---|
| Are customers returning? | New versus returning and repeat rate | Stacked trend | 5 |
| How frequently do cohorts return? | Repeat purchase by first-purchase cohort | Cohort heatmap | 5 |
| How are customers distributed by value? | Recency, frequency, and monetary segments | Segment matrix or bubble plot | 5 |
| Which basket missions exist? | Basket composition clusters | Segment cards and parallel coordinates only when interpretable | 6 |
| Where do baskets lose value? | Browse-to-purchase funnel, if upstream events exist | Funnel chart | Later |

## Store and location operations

| Owner question | Metric or analysis | Recommended visual | Milestone |
|---|---|---|---|
| Which locations outperform peers? | Sales, margin, orders, and growth by location | Ranked bars or dot plot | 5 |
| Is performance related to store size? | Sales/margin versus square footage | Scatter plot | 5 |
| Where are regional patterns? | Location metric by geography | Map only when geography answers the question | 5 |
| How consistent are locations? | Metric distribution across stores | Box plot | 5 |
| What needs operational attention? | Sync lag, stockouts, waste, and exceptions | Operations scorecard | 3 and 5 |

Maps should not be used for a single location or when a ranked table communicates the result more accurately.

## Supplier performance

| Owner question | Metric or analysis | Recommended visual | Milestone |
|---|---|---|---|
| Which suppliers are reliable? | On-time and in-full rate | Ranked bars with sample size | 4 and 5 |
| How variable is lead time? | Actual receipt lead time distribution | Box plot or histogram | 5 |
| What is due or late? | Purchase orders by expected date/status | Timeline and exception table | 4 |
| Is cost changing? | Unit cost history and variance | Step line with change annotations | 5 |
| Is spend concentrated? | Spend by supplier/category | Pareto chart or treemap | 5 |

## Automation analytics

| Owner question | Metric or analysis | Recommended visual | Milestone |
|---|---|---|---|
| What did the system do? | Drafted, approved, sent, delivered, failed, canceled | Status funnel plus audit table | 4 |
| Are alerts useful? | Approval, edit, dismissal, and duplicate-prevention rates | Stacked trend | 4 and 6 |
| Did reorders prevent stockouts? | Treated versus comparable untreated inventory episodes | Outcome comparison with uncertainty | 6 |
| Where are rules noisy? | Runs and dismissals by rule/product | Ranked exception table | 4 |
| Is delivery reliable? | Message success, retry, and latency | Time series and percentile summary | 4 |

An automation dashboard must never count a drafted message as a sent order. Every state change needs an actor, timestamp, rule version, and reason.

## AI quality and explainability

| Owner question | Metric or analysis | Recommended visual | Milestone |
|---|---|---|---|
| How accurate are forecasts? | MAE, WAPE, bias, and interval coverage | Trend plus distribution | 6 |
| Where is the model uncertain? | Forecast confidence by product/location | Ranked table and confidence bands | 6 |
| Does the recommendation help? | Stockout, waste, and working-capital outcome | Controlled before/after or matched comparison | 6 |
| What influenced the suggestion? | Lead time, demand, safety stock, open orders, case pack | Explanation waterfall | 6 |
| When should AI abstain? | Quality/coverage thresholds and sparse-data reasons | Coverage matrix | 6 |

Model quality must be measured separately by location, category, demand level, and forecast horizon. A single average accuracy number can conceal dangerous failures on high-value or intermittent-demand items.

## Visualization interaction standards

- A chart title states the metric, not a vague topic.
- Axes include units; currency uses the selected currency and locale.
- Tooltips show exact value, interval, comparison, and source freshness.
- Color is not the only carrier of meaning.
- Legends are ordered to match the visual stack.
- Zero baselines are required for magnitude bars; truncated axes must be explicit on line charts.
- Dual axes are avoided unless the relationship is essential and clearly labelled.
- Donut charts are limited to a small number of parts; detailed composition uses bars or a table.
- Tables support sorting, filtering, pinned identifiers, and accessible row actions.
- Empty, loading, stale, partial, error, and insufficient-sample states are designed explicitly.
- Motion explains transitions and respects `prefers-reduced-motion`; it never delays access to a value.

## Delivery sequence

1. Keep the Milestone 1 overview as the owner’s fast daily entry point.
2. Build canonical, tested data definitions in Milestone 2.
3. Prove source freshness and reconciliation through the first POS adapter in Milestone 3.
4. Add deterministic, auditable supplier workflows in Milestone 4.
5. Expand analytical breadth only after costs, sales, and inventory history are trustworthy.
6. Add forecasts and AI recommendations only with evaluation, confidence, abstention, and human-control mechanisms.
