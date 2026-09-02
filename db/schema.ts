import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const createdAt = () => text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`);

export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  currencyCode: text("currency_code").notNull().default("CAD"),
  createdAt: createdAt(),
});

export const locations = sqliteTable("locations", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  addressLine: text("address_line"),
  timezone: text("timezone").notNull(),
  createdAt: createdAt(),
}, (table) => [index("idx_locations_organization").on(table.organizationId)]);

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  parentId: text("parent_id"),
  name: text("name").notNull(),
  createdAt: createdAt(),
}, (table) => [
  uniqueIndex("idx_categories_org_name").on(table.organizationId, table.name),
]);

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  categoryId: text("category_id").references(() => categories.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  brand: text("brand"),
  status: text("status", { enum: ["active", "archived"] }).notNull().default("active"),
  createdAt: createdAt(),
}, (table) => [
  index("idx_products_org_category").on(table.organizationId, table.categoryId),
]);

export const variants = sqliteTable("variants", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  sku: text("sku").notNull(),
  barcode: text("barcode"),
  priceCents: integer("price_cents").notNull(),
  costCents: integer("cost_cents"),
  unitName: text("unit_name").notNull().default("each"),
  createdAt: createdAt(),
}, (table) => [
  uniqueIndex("idx_variants_sku").on(table.sku),
  uniqueIndex("idx_variants_barcode").on(table.barcode),
  index("idx_variants_product").on(table.productId),
]);

export const suppliers = sqliteTable("suppliers", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  isVerified: integer("is_verified", { mode: "boolean" }).notNull().default(false),
  createdAt: createdAt(),
}, (table) => [index("idx_suppliers_organization").on(table.organizationId)]);

export const supplierItems = sqliteTable("supplier_items", {
  id: text("id").primaryKey(),
  supplierId: text("supplier_id").notNull().references(() => suppliers.id, { onDelete: "cascade" }),
  variantId: text("variant_id").notNull().references(() => variants.id, { onDelete: "cascade" }),
  supplierSku: text("supplier_sku"),
  casePack: integer("case_pack").notNull().default(1),
  leadTimeDays: integer("lead_time_days").notNull().default(1),
  unitCostCents: integer("unit_cost_cents"),
  isPreferred: integer("is_preferred", { mode: "boolean" }).notNull().default(false),
  createdAt: createdAt(),
}, (table) => [
  uniqueIndex("idx_supplier_items_pair").on(table.supplierId, table.variantId),
  index("idx_supplier_items_variant").on(table.variantId),
]);

export const inventorySnapshots = sqliteTable("inventory_snapshots", {
  id: text("id").primaryKey(),
  locationId: text("location_id").notNull().references(() => locations.id, { onDelete: "cascade" }),
  variantId: text("variant_id").notNull().references(() => variants.id, { onDelete: "cascade" }),
  onHandMilliunits: integer("on_hand_milliunits").notNull(),
  reservedMilliunits: integer("reserved_milliunits").notNull().default(0),
  unavailableMilliunits: integer("unavailable_milliunits").notNull().default(0),
  capturedAt: text("captured_at").notNull(),
  source: text("source").notNull().default("manual"),
}, (table) => [
  index("idx_inventory_location_variant_time").on(table.locationId, table.variantId, table.capturedAt),
]);

export const inventoryMovements = sqliteTable("inventory_movements", {
  id: text("id").primaryKey(),
  locationId: text("location_id").notNull().references(() => locations.id, { onDelete: "cascade" }),
  variantId: text("variant_id").notNull().references(() => variants.id, { onDelete: "cascade" }),
  quantityMilliunits: integer("quantity_milliunits").notNull(),
  reason: text("reason", { enum: ["sale", "receipt", "refund", "waste", "shrink", "transfer", "adjustment"] }).notNull(),
  sourceReference: text("source_reference"),
  occurredAt: text("occurred_at").notNull(),
  createdAt: createdAt(),
}, (table) => [
  index("idx_movements_location_variant_time").on(table.locationId, table.variantId, table.occurredAt),
]);

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  locationId: text("location_id").notNull().references(() => locations.id, { onDelete: "cascade" }),
  status: text("status", { enum: ["open", "completed", "canceled", "refunded", "partially_refunded"] }).notNull(),
  grossSalesCents: integer("gross_sales_cents").notNull(),
  discountCents: integer("discount_cents").notNull().default(0),
  refundCents: integer("refund_cents").notNull().default(0),
  netSalesCents: integer("net_sales_cents").notNull(),
  currencyCode: text("currency_code").notNull(),
  occurredAt: text("occurred_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [
  index("idx_orders_location_status_time").on(table.locationId, table.status, table.occurredAt),
  index("idx_orders_organization_time").on(table.organizationId, table.occurredAt),
]);

export const orderLines = sqliteTable("order_lines", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  variantId: text("variant_id").notNull().references(() => variants.id, { onDelete: "restrict" }),
  quantityMilliunits: integer("quantity_milliunits").notNull(),
  grossSalesCents: integer("gross_sales_cents").notNull(),
  discountCents: integer("discount_cents").notNull().default(0),
  refundCents: integer("refund_cents").notNull().default(0),
  netSalesCents: integer("net_sales_cents").notNull(),
  estimatedCostCents: integer("estimated_cost_cents"),
}, (table) => [
  index("idx_order_lines_order").on(table.orderId),
  index("idx_order_lines_variant").on(table.variantId),
]);

export const reorderRules = sqliteTable("reorder_rules", {
  id: text("id").primaryKey(),
  locationId: text("location_id").notNull().references(() => locations.id, { onDelete: "cascade" }),
  variantId: text("variant_id").notNull().references(() => variants.id, { onDelete: "cascade" }),
  supplierId: text("supplier_id").references(() => suppliers.id, { onDelete: "set null" }),
  thresholdMilliunits: integer("threshold_milliunits").notNull(),
  targetMilliunits: integer("target_milliunits").notNull(),
  cooldownHours: integer("cooldown_hours").notNull().default(24),
  approvalMode: text("approval_mode", { enum: ["draft", "automatic"] }).notNull().default("draft"),
  isEnabled: integer("is_enabled", { mode: "boolean" }).notNull().default(true),
  updatedAt: text("updated_at").notNull(),
}, (table) => [
  uniqueIndex("idx_reorder_rules_location_variant").on(table.locationId, table.variantId),
]);

export const automationRuns = sqliteTable("automation_runs", {
  id: text("id").primaryKey(),
  ruleId: text("rule_id").notNull().references(() => reorderRules.id, { onDelete: "restrict" }),
  idempotencyKey: text("idempotency_key").notNull(),
  status: text("status", { enum: ["drafted", "approved", "sent", "delivered", "failed", "canceled", "skipped"] }).notNull(),
  triggerQuantityMilliunits: integer("trigger_quantity_milliunits").notNull(),
  ruleVersion: integer("rule_version").notNull().default(1),
  createdAt: createdAt(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [
  uniqueIndex("idx_automation_runs_idempotency").on(table.idempotencyKey),
  index("idx_automation_runs_rule_status").on(table.ruleId, table.status),
]);

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  automationRunId: text("automation_run_id").notNull().references(() => automationRuns.id, { onDelete: "cascade" }),
  channel: text("channel", { enum: ["email", "sms"] }).notNull(),
  recipient: text("recipient").notNull(),
  contentHash: text("content_hash").notNull(),
  providerMessageId: text("provider_message_id"),
  status: text("status", { enum: ["queued", "sent", "delivered", "failed"] }).notNull(),
  createdAt: createdAt(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [index("idx_notifications_run_status").on(table.automationRunId, table.status)]);

export const externalReferences = sqliteTable("external_references", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  entityType: text("entity_type").notNull(),
  externalId: text("external_id").notNull(),
  internalId: text("internal_id").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [
  uniqueIndex("idx_external_refs_provider_entity").on(table.organizationId, table.provider, table.entityType, table.externalId),
]);

export const dailyStoreMetrics = sqliteTable("daily_store_metrics", {
  id: text("id").primaryKey(),
  locationId: text("location_id").notNull().references(() => locations.id, { onDelete: "cascade" }),
  metricDate: text("metric_date").notNull(),
  netSalesCents: integer("net_sales_cents").notNull(),
  orderCount: integer("order_count").notNull(),
  unitsMilliunits: integer("units_milliunits").notNull(),
  grossMarginCents: integer("gross_margin_cents"),
  refreshedAt: text("refreshed_at").notNull(),
}, (table) => [
  uniqueIndex("idx_store_metrics_location_date").on(table.locationId, table.metricDate),
]);

export const dailyProductMetrics = sqliteTable("daily_product_metrics", {
  id: text("id").primaryKey(),
  locationId: text("location_id").notNull().references(() => locations.id, { onDelete: "cascade" }),
  variantId: text("variant_id").notNull().references(() => variants.id, { onDelete: "cascade" }),
  metricDate: text("metric_date").notNull(),
  unitsSoldMilliunits: integer("units_sold_milliunits").notNull(),
  netSalesCents: integer("net_sales_cents").notNull(),
  grossMarginCents: integer("gross_margin_cents"),
  sevenDayTrendBasisPoints: integer("seven_day_trend_basis_points"),
  refreshedAt: text("refreshed_at").notNull(),
}, (table) => [
  uniqueIndex("idx_product_metrics_location_variant_date").on(table.locationId, table.variantId, table.metricDate),
  index("idx_product_metrics_location_date").on(table.locationId, table.metricDate),
]);
