import { getD1 } from "../../../db";

export const dynamic = "force-dynamic";

const DEMO_LOCATION_ID = "loc-downtown";

type LocationRow = {
  id: string;
  name: string;
  timezone: string;
  currencyCode: string;
};

type StoreMetricRow = {
  metricDate: string;
  netSalesCents: number;
  orderCount: number;
  unitsMilliunits: number;
  grossMarginCents: number | null;
  refreshedAt: string;
};

type ProductRow = {
  variantId: string;
  name: string;
  sku: string;
  category: string;
  priceCents: number;
  costCents: number | null;
  stockMilliunits: number;
  reorderThresholdMilliunits: number;
  unitsSoldMilliunits: number;
  netSalesCents: number;
  trendBasisPoints: number | null;
  capturedAt: string;
};

type CategoryRow = {
  name: string;
  netSalesCents: number;
};

function toUnits(milliunits: number) {
  return Math.round(milliunits / 1000);
}

export async function GET() {
  try {
    const d1 = getD1();
    const location = await d1.prepare(`
      SELECT
        l.id,
        l.name,
        l.timezone,
        o.currency_code AS currencyCode
      FROM locations l
      INNER JOIN organizations o ON o.id = l.organization_id
      WHERE l.id = ?
    `).bind(DEMO_LOCATION_ID).first<LocationRow>();

    if (!location) {
      return Response.json({ error: "No configured retail location was found." }, { status: 404 });
    }

    const metrics = await d1.prepare(`
      SELECT
        metric_date AS metricDate,
        net_sales_cents AS netSalesCents,
        order_count AS orderCount,
        units_milliunits AS unitsMilliunits,
        gross_margin_cents AS grossMarginCents,
        refreshed_at AS refreshedAt
      FROM daily_store_metrics
      WHERE location_id = ?
      ORDER BY metric_date DESC
      LIMIT 30
    `).bind(DEMO_LOCATION_ID).all<StoreMetricRow>();

    const productRows = await d1.prepare(`
      WITH latest_inventory AS (
        SELECT
          location_id,
          variant_id,
          on_hand_milliunits - reserved_milliunits - unavailable_milliunits AS stock_milliunits,
          captured_at,
          ROW_NUMBER() OVER (
            PARTITION BY location_id, variant_id
            ORDER BY captured_at DESC, id DESC
          ) AS row_number
        FROM inventory_snapshots
        WHERE location_id = ?
      ), latest_metric_date AS (
        SELECT MAX(metric_date) AS metric_date
        FROM daily_product_metrics
        WHERE location_id = ?
      )
      SELECT
        v.id AS variantId,
        p.name,
        v.sku,
        c.name AS category,
        v.price_cents AS priceCents,
        v.cost_cents AS costCents,
        COALESCE(li.stock_milliunits, 0) AS stockMilliunits,
        COALESCE(rr.threshold_milliunits, 0) AS reorderThresholdMilliunits,
        COALESCE(dpm.units_sold_milliunits, 0) AS unitsSoldMilliunits,
        COALESCE(dpm.net_sales_cents, 0) AS netSalesCents,
        dpm.seven_day_trend_basis_points AS trendBasisPoints,
        COALESCE(li.captured_at, dpm.refreshed_at) AS capturedAt
      FROM variants v
      INNER JOIN products p ON p.id = v.product_id
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN latest_inventory li
        ON li.variant_id = v.id AND li.location_id = ? AND li.row_number = 1
      LEFT JOIN reorder_rules rr
        ON rr.variant_id = v.id AND rr.location_id = ? AND rr.is_enabled = 1
      LEFT JOIN daily_product_metrics dpm
        ON dpm.variant_id = v.id
        AND dpm.location_id = ?
        AND dpm.metric_date = (SELECT metric_date FROM latest_metric_date)
      WHERE p.organization_id = (
        SELECT organization_id FROM locations WHERE id = ?
      ) AND p.status = 'active'
      ORDER BY dpm.units_sold_milliunits DESC, p.name ASC
    `).bind(
      DEMO_LOCATION_ID,
      DEMO_LOCATION_ID,
      DEMO_LOCATION_ID,
      DEMO_LOCATION_ID,
      DEMO_LOCATION_ID,
      DEMO_LOCATION_ID,
    ).all<ProductRow>();

    const categoryRows = await d1.prepare(`
      WITH latest_metric_date AS (
        SELECT MAX(metric_date) AS metric_date
        FROM daily_product_metrics
        WHERE location_id = ?
      )
      SELECT c.name, SUM(dpm.net_sales_cents) AS netSalesCents
      FROM daily_product_metrics dpm
      INNER JOIN variants v ON v.id = dpm.variant_id
      INNER JOIN products p ON p.id = v.product_id
      INNER JOIN categories c ON c.id = p.category_id
      WHERE dpm.location_id = ?
        AND dpm.metric_date = (SELECT metric_date FROM latest_metric_date)
      GROUP BY c.id, c.name
      ORDER BY netSalesCents DESC
    `).bind(DEMO_LOCATION_ID, DEMO_LOCATION_ID).all<CategoryRow>();

    const [current, previous] = metrics.results;
    if (!current) {
      return Response.json({ error: "No store metrics are available yet." }, { status: 404 });
    }

    const products = productRows.results.map((product) => ({
      id: product.variantId,
      name: product.name,
      sku: product.sku,
      category: product.category ?? "Uncategorized",
      priceCents: product.priceCents,
      costCents: product.costCents,
      sold: toUnits(product.unitsSoldMilliunits),
      stock: toUnits(product.stockMilliunits),
      reorder: toUnits(product.reorderThresholdMilliunits),
      trend: (product.trendBasisPoints ?? 0) / 100,
      capturedAt: product.capturedAt,
    }));

    const lowStockCount = products.filter((product) => product.stock <= product.reorder).length;
    const outOfStockCount = products.filter((product) => product.stock <= 0).length;
    const lowStockCategoryCount = new Set(products.filter((product) => product.stock <= product.reorder).map((product) => product.category)).size;
    const periodNetSalesCents = metrics.results.reduce((sum, metric) => sum + metric.netSalesCents, 0);

    return Response.json({
      source: "database",
      location,
      summary: {
        metricDate: current.metricDate,
        netSalesCents: current.netSalesCents,
        previousNetSalesCents: previous?.netSalesCents ?? null,
        orderCount: current.orderCount,
        previousOrderCount: previous?.orderCount ?? null,
        averageOrderValueCents: current.orderCount > 0 ? Math.round(current.netSalesCents / current.orderCount) : 0,
        previousAverageOrderValueCents: previous && previous.orderCount > 0 ? Math.round(previous.netSalesCents / previous.orderCount) : null,
        unitsSold: toUnits(current.unitsMilliunits),
        grossMarginCents: current.grossMarginCents,
        lowStockCount,
        outOfStockCount,
        categoryCount: lowStockCategoryCount,
        periodNetSalesCents,
        refreshedAt: current.refreshedAt,
      },
      salesSeries: metrics.results.slice().reverse().map((metric) => ({
        date: metric.metricDate,
        netSalesCents: metric.netSalesCents,
        orders: metric.orderCount,
      })),
      categorySales: categoryRows.results,
      products,
    }, {
      headers: {
        "Cache-Control": "private, no-store",
        "X-Northstar-Data-Source": "d1",
      },
    });
  } catch (error) {
    console.error("Dashboard data request failed", error);
    return Response.json({
      error: "The retail database is not ready. Apply the latest migration and try again.",
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
