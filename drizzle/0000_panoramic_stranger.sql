CREATE TABLE IF NOT EXISTS `automation_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`rule_id` text NOT NULL,
	`idempotency_key` text NOT NULL,
	`status` text NOT NULL,
	`trigger_quantity_milliunits` integer NOT NULL,
	`rule_version` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`rule_id`) REFERENCES `reorder_rules`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_automation_runs_idempotency` ON `automation_runs` (`idempotency_key`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_automation_runs_rule_status` ON `automation_runs` (`rule_id`,`status`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`parent_id` text,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_categories_org_name` ON `categories` (`organization_id`,`name`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `daily_product_metrics` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`variant_id` text NOT NULL,
	`metric_date` text NOT NULL,
	`units_sold_milliunits` integer NOT NULL,
	`net_sales_cents` integer NOT NULL,
	`gross_margin_cents` integer,
	`seven_day_trend_basis_points` integer,
	`refreshed_at` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `variants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_product_metrics_location_variant_date` ON `daily_product_metrics` (`location_id`,`variant_id`,`metric_date`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_product_metrics_location_date` ON `daily_product_metrics` (`location_id`,`metric_date`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `daily_store_metrics` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`metric_date` text NOT NULL,
	`net_sales_cents` integer NOT NULL,
	`order_count` integer NOT NULL,
	`units_milliunits` integer NOT NULL,
	`gross_margin_cents` integer,
	`refreshed_at` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_store_metrics_location_date` ON `daily_store_metrics` (`location_id`,`metric_date`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `external_references` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`provider` text NOT NULL,
	`entity_type` text NOT NULL,
	`external_id` text NOT NULL,
	`internal_id` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_external_refs_provider_entity` ON `external_references` (`organization_id`,`provider`,`entity_type`,`external_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `inventory_movements` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`variant_id` text NOT NULL,
	`quantity_milliunits` integer NOT NULL,
	`reason` text NOT NULL,
	`source_reference` text,
	`occurred_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `variants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_movements_location_variant_time` ON `inventory_movements` (`location_id`,`variant_id`,`occurred_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `inventory_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`variant_id` text NOT NULL,
	`on_hand_milliunits` integer NOT NULL,
	`reserved_milliunits` integer DEFAULT 0 NOT NULL,
	`unavailable_milliunits` integer DEFAULT 0 NOT NULL,
	`captured_at` text NOT NULL,
	`source` text DEFAULT 'manual' NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `variants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_inventory_location_variant_time` ON `inventory_snapshots` (`location_id`,`variant_id`,`captured_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `locations` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`name` text NOT NULL,
	`address_line` text,
	`timezone` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_locations_organization` ON `locations` (`organization_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`automation_run_id` text NOT NULL,
	`channel` text NOT NULL,
	`recipient` text NOT NULL,
	`content_hash` text NOT NULL,
	`provider_message_id` text,
	`status` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`automation_run_id`) REFERENCES `automation_runs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_notifications_run_status` ON `notifications` (`automation_run_id`,`status`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `order_lines` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`variant_id` text NOT NULL,
	`quantity_milliunits` integer NOT NULL,
	`gross_sales_cents` integer NOT NULL,
	`discount_cents` integer DEFAULT 0 NOT NULL,
	`refund_cents` integer DEFAULT 0 NOT NULL,
	`net_sales_cents` integer NOT NULL,
	`estimated_cost_cents` integer,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `variants`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_order_lines_order` ON `order_lines` (`order_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_order_lines_variant` ON `order_lines` (`variant_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`location_id` text NOT NULL,
	`status` text NOT NULL,
	`gross_sales_cents` integer NOT NULL,
	`discount_cents` integer DEFAULT 0 NOT NULL,
	`refund_cents` integer DEFAULT 0 NOT NULL,
	`net_sales_cents` integer NOT NULL,
	`currency_code` text NOT NULL,
	`occurred_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_orders_location_status_time` ON `orders` (`location_id`,`status`,`occurred_at`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_orders_organization_time` ON `orders` (`organization_id`,`occurred_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`currency_code` text DEFAULT 'CAD' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `products` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`category_id` text,
	`name` text NOT NULL,
	`brand` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_products_org_category` ON `products` (`organization_id`,`category_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `reorder_rules` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`variant_id` text NOT NULL,
	`supplier_id` text,
	`threshold_milliunits` integer NOT NULL,
	`target_milliunits` integer NOT NULL,
	`cooldown_hours` integer DEFAULT 24 NOT NULL,
	`approval_mode` text DEFAULT 'draft' NOT NULL,
	`is_enabled` integer DEFAULT true NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `variants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_reorder_rules_location_variant` ON `reorder_rules` (`location_id`,`variant_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `supplier_items` (
	`id` text PRIMARY KEY NOT NULL,
	`supplier_id` text NOT NULL,
	`variant_id` text NOT NULL,
	`supplier_sku` text,
	`case_pack` integer DEFAULT 1 NOT NULL,
	`lead_time_days` integer DEFAULT 1 NOT NULL,
	`unit_cost_cents` integer,
	`is_preferred` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `variants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_supplier_items_pair` ON `supplier_items` (`supplier_id`,`variant_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_supplier_items_variant` ON `supplier_items` (`variant_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `suppliers` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`is_verified` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_suppliers_organization` ON `suppliers` (`organization_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `variants` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`sku` text NOT NULL,
	`barcode` text,
	`price_cents` integer NOT NULL,
	`cost_cents` integer,
	`unit_name` text DEFAULT 'each' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_variants_sku` ON `variants` (`sku`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_variants_barcode` ON `variants` (`barcode`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_variants_product` ON `variants` (`product_id`);
--> statement-breakpoint
INSERT OR IGNORE INTO `organizations` (`id`, `name`, `currency_code`) VALUES
  ('org-northstar-demo', 'Northstar Demo Retail', 'CAD');
--> statement-breakpoint
INSERT OR IGNORE INTO `locations` (`id`, `organization_id`, `name`, `address_line`, `timezone`) VALUES
  ('loc-downtown', 'org-northstar-demo', 'Downtown Market', 'Toronto, Ontario', 'America/Toronto');
--> statement-breakpoint
INSERT OR IGNORE INTO `categories` (`id`, `organization_id`, `name`) VALUES
  ('cat-dairy', 'org-northstar-demo', 'Dairy'),
  ('cat-produce', 'org-northstar-demo', 'Produce'),
  ('cat-bakery', 'org-northstar-demo', 'Bakery'),
  ('cat-beverages', 'org-northstar-demo', 'Beverages'),
  ('cat-snacks', 'org-northstar-demo', 'Snacks');
--> statement-breakpoint
INSERT OR IGNORE INTO `products` (`id`, `organization_id`, `category_id`, `name`, `brand`) VALUES
  ('prod-milk', 'org-northstar-demo', 'cat-dairy', 'Organic Whole Milk', 'Meadow North'),
  ('prod-avocado', 'org-northstar-demo', 'cat-produce', 'Avocado Hass Bag', 'Fresh Select'),
  ('prod-sourdough', 'org-northstar-demo', 'cat-bakery', 'Sourdough Loaf', 'Downtown Bakery'),
  ('prod-water', 'org-northstar-demo', 'cat-beverages', 'Sparkling Water 8pk', 'Clear Spring'),
  ('prod-chips', 'org-northstar-demo', 'cat-snacks', 'Sea Salt Kettle Chips', 'Crisp House'),
  ('prod-eggs', 'org-northstar-demo', 'cat-dairy', 'Free Range Eggs', 'Meadow North');
--> statement-breakpoint
INSERT OR IGNORE INTO `variants` (`id`, `product_id`, `sku`, `barcode`, `price_cents`, `cost_cents`) VALUES
  ('var-milk', 'prod-milk', 'DRY-1042', '0620000001042', 549, 318),
  ('var-avocado', 'prod-avocado', 'PRD-2261', '0620000002261', 699, 402),
  ('var-sourdough', 'prod-sourdough', 'BAK-0318', '0620000000318', 479, 210),
  ('var-water', 'prod-water', 'BEV-1408', '0620000001408', 799, 438),
  ('var-chips', 'prod-chips', 'SNK-4209', '0620000004209', 349, 184),
  ('var-eggs', 'prod-eggs', 'DRY-1118', '0620000001118', 629, 367);
--> statement-breakpoint
INSERT OR IGNORE INTO `suppliers` (`id`, `organization_id`, `name`, `email`, `phone`, `is_verified`) VALUES
  ('supplier-cityline', 'org-northstar-demo', 'Cityline Wholesale', 'orders@example.invalid', NULL, 0);
--> statement-breakpoint
INSERT OR IGNORE INTO `supplier_items` (`id`, `supplier_id`, `variant_id`, `supplier_sku`, `case_pack`, `lead_time_days`, `unit_cost_cents`, `is_preferred`) VALUES
  ('si-milk', 'supplier-cityline', 'var-milk', 'CW-DAI-1042', 12, 1, 318, 1),
  ('si-avocado', 'supplier-cityline', 'var-avocado', 'CW-PRO-2261', 8, 2, 402, 1),
  ('si-sourdough', 'supplier-cityline', 'var-sourdough', 'CW-BAK-0318', 10, 1, 210, 1),
  ('si-water', 'supplier-cityline', 'var-water', 'CW-BEV-1408', 6, 2, 438, 1),
  ('si-chips', 'supplier-cityline', 'var-chips', 'CW-SNK-4209', 18, 2, 184, 1),
  ('si-eggs', 'supplier-cityline', 'var-eggs', 'CW-DAI-1118', 12, 1, 367, 1);
--> statement-breakpoint
INSERT OR IGNORE INTO `inventory_snapshots` (`id`, `location_id`, `variant_id`, `on_hand_milliunits`, `captured_at`, `source`) VALUES
  ('snap-milk-20260901', 'loc-downtown', 'var-milk', 6000, '2026-09-01T13:30:00Z', 'seed'),
  ('snap-avocado-20260901', 'loc-downtown', 'var-avocado', 18000, '2026-09-01T13:30:00Z', 'seed'),
  ('snap-sourdough-20260901', 'loc-downtown', 'var-sourdough', 3000, '2026-09-01T13:30:00Z', 'seed'),
  ('snap-water-20260901', 'loc-downtown', 'var-water', 27000, '2026-09-01T13:30:00Z', 'seed'),
  ('snap-chips-20260901', 'loc-downtown', 'var-chips', 0, '2026-09-01T13:30:00Z', 'seed'),
  ('snap-eggs-20260901', 'loc-downtown', 'var-eggs', 9000, '2026-09-01T13:30:00Z', 'seed');
--> statement-breakpoint
INSERT OR IGNORE INTO `reorder_rules` (`id`, `location_id`, `variant_id`, `supplier_id`, `threshold_milliunits`, `target_milliunits`, `cooldown_hours`, `approval_mode`, `is_enabled`, `updated_at`) VALUES
  ('rule-milk', 'loc-downtown', 'var-milk', 'supplier-cityline', 12000, 36000, 24, 'draft', 1, '2026-09-01T13:30:00Z'),
  ('rule-avocado', 'loc-downtown', 'var-avocado', 'supplier-cityline', 10000, 30000, 24, 'draft', 1, '2026-09-01T13:30:00Z'),
  ('rule-sourdough', 'loc-downtown', 'var-sourdough', 'supplier-cityline', 8000, 24000, 24, 'draft', 1, '2026-09-01T13:30:00Z'),
  ('rule-water', 'loc-downtown', 'var-water', 'supplier-cityline', 12000, 36000, 24, 'draft', 1, '2026-09-01T13:30:00Z'),
  ('rule-chips', 'loc-downtown', 'var-chips', 'supplier-cityline', 15000, 45000, 24, 'draft', 1, '2026-09-01T13:30:00Z'),
  ('rule-eggs', 'loc-downtown', 'var-eggs', 'supplier-cityline', 10000, 30000, 24, 'draft', 1, '2026-09-01T13:30:00Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `daily_store_metrics` (`id`, `location_id`, `metric_date`, `net_sales_cents`, `order_count`, `units_milliunits`, `gross_margin_cents`, `refreshed_at`) VALUES
  ('dsm-downtown-20260831', 'loc-downtown', '2026-08-31', 749320, 229, 541000, 283940, '2026-09-01T04:05:00Z'),
  ('dsm-downtown-20260901', 'loc-downtown', '2026-09-01', 842960, 248, 587000, 326410, '2026-09-01T13:30:00Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `daily_product_metrics` (`id`, `location_id`, `variant_id`, `metric_date`, `units_sold_milliunits`, `net_sales_cents`, `gross_margin_cents`, `seven_day_trend_basis_points`, `refreshed_at`) VALUES
  ('dpm-milk-20260901', 'loc-downtown', 'var-milk', '2026-09-01', 142000, 77958, 32802, 820, '2026-09-01T13:30:00Z'),
  ('dpm-avocado-20260901', 'loc-downtown', 'var-avocado', '2026-09-01', 118000, 82482, 35046, 1240, '2026-09-01T13:30:00Z'),
  ('dpm-sourdough-20260901', 'loc-downtown', 'var-sourdough', '2026-09-01', 96000, 45984, 25824, -310, '2026-09-01T13:30:00Z'),
  ('dpm-water-20260901', 'loc-downtown', 'var-water', '2026-09-01', 89000, 71111, 32129, 570, '2026-09-01T13:30:00Z'),
  ('dpm-chips-20260901', 'loc-downtown', 'var-chips', '2026-09-01', 74000, 25826, 12210, 1680, '2026-09-01T13:30:00Z'),
  ('dpm-eggs-20260901', 'loc-downtown', 'var-eggs', '2026-09-01', 68000, 42772, 17816, 230, '2026-09-01T13:30:00Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `external_references` (`id`, `organization_id`, `provider`, `entity_type`, `external_id`, `internal_id`, `updated_at`) VALUES
  ('ext-demo-location', 'org-northstar-demo', 'demo', 'location', 'downtown-market', 'loc-downtown', '2026-09-01T13:30:00Z');
