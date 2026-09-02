import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";

const root = new URL("../", import.meta.url);

test("migration creates the canonical retail schema and demo records", async () => {
  const migration = await readFile(new URL("drizzle/0000_panoramic_stranger.sql", root), "utf8");
  const database = new DatabaseSync(":memory:");
  database.exec("PRAGMA foreign_keys = ON;");
  database.exec(migration.replaceAll("--> statement-breakpoint", ""));

  const tableCount = database.prepare("SELECT COUNT(*) AS count FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%'").get();
  const productCount = database.prepare("SELECT COUNT(*) AS count FROM products").get();
  const ruleCount = database.prepare("SELECT COUNT(*) AS count FROM reorder_rules").get();
  const lowStockCount = database.prepare(`
    SELECT COUNT(*) AS count
    FROM reorder_rules rules
    INNER JOIN inventory_snapshots inventory ON inventory.variant_id = rules.variant_id AND inventory.location_id = rules.location_id
    WHERE inventory.on_hand_milliunits - inventory.reserved_milliunits - inventory.unavailable_milliunits <= rules.threshold_milliunits
  `).get();
  const foreignKeyErrors = database.prepare("PRAGMA foreign_key_check").all();
  const queryPlan = database.prepare(`
    EXPLAIN QUERY PLAN
    SELECT * FROM orders
    WHERE location_id = ? AND status = ? AND occurred_at >= ?
  `).all("loc-downtown", "completed", "2026-09-01");

  assert.equal(tableCount.count, 17);
  assert.equal(productCount.count, 6);
  assert.equal(ruleCount.count, 6);
  assert.equal(lowStockCount.count, 4);
  assert.deepEqual(foreignKeyErrors, []);
  assert.match(queryPlan.map((row) => row.detail).join(" "), /idx_orders_location_status_time/);

  database.exec(`
    INSERT INTO organizations (id, name, currency_code) VALUES ('org-other', 'Other Retailer', 'USD');
    INSERT INTO locations (id, organization_id, name, timezone) VALUES ('loc-other', 'org-other', 'Other Store', 'UTC');
    INSERT INTO categories (id, organization_id, name) VALUES ('cat-other', 'org-other', 'Other');
    INSERT INTO products (id, organization_id, category_id, name) VALUES ('prod-other', 'org-other', 'cat-other', 'Private Product');
    INSERT INTO variants (id, product_id, sku, price_cents) VALUES ('var-other', 'prod-other', 'OTHER-001', 100);
  `);
  const scopedProducts = database.prepare(`
    SELECT p.id
    FROM products p
    INNER JOIN variants v ON v.product_id = p.id
    WHERE p.organization_id = (SELECT organization_id FROM locations WHERE id = ?)
    ORDER BY p.id
  `).all("loc-downtown");
  assert.equal(scopedProducts.length, 6);
  assert.equal(scopedProducts.some(({ id }) => id === "prod-other"), false);

  database.exec(migration.replaceAll("--> statement-breakpoint", ""));
  assert.equal(database.prepare("SELECT COUNT(*) AS count FROM products").get().count, 7);
  assert.equal(database.prepare("SELECT COUNT(*) AS count FROM inventory_snapshots").get().count, 6);
  database.close();
});

test("dashboard API uses prepared D1 reads and private no-store responses", async () => {
  const route = await readFile(new URL("app/api/dashboard/route.ts", root), "utf8");
  assert.match(route, /\.prepare\(`/);
  assert.match(route, /\.bind\(/);
  assert.match(route, /Cache-Control.*private, no-store/s);
  assert.match(route, /X-Northstar-Data-Source.*d1/s);
  assert.doesNotMatch(route, /\.exec\(/);
});
