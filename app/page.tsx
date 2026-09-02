"use client";

import { useMemo, useState } from "react";

type Product = { id: number; name: string; sku: string; category: string; price: number; sold: number; stock: number; reorder: number; trend: number; color: string; initials: string };

const products: Product[] = [
  { id: 1, name: "Organic Whole Milk", sku: "DRY-1042", category: "Dairy", price: 5.49, sold: 142, stock: 6, reorder: 12, trend: 8.2, color: "#e4f1ff", initials: "OM" },
  { id: 2, name: "Avocado Hass Bag", sku: "PRD-2261", category: "Produce", price: 6.99, sold: 118, stock: 18, reorder: 10, trend: 12.4, color: "#e6f4de", initials: "AH" },
  { id: 3, name: "Sourdough Loaf", sku: "BAK-0318", category: "Bakery", price: 4.79, sold: 96, stock: 3, reorder: 8, trend: -3.1, color: "#fff0d2", initials: "SL" },
  { id: 4, name: "Sparkling Water 8pk", sku: "BEV-1408", category: "Beverages", price: 7.99, sold: 89, stock: 27, reorder: 12, trend: 5.7, color: "#def3f1", initials: "SW" },
  { id: 5, name: "Sea Salt Kettle Chips", sku: "SNK-4209", category: "Snacks", price: 3.49, sold: 74, stock: 0, reorder: 15, trend: 16.8, color: "#f6e7d5", initials: "KC" },
  { id: 6, name: "Free Range Eggs", sku: "DRY-1118", category: "Dairy", price: 6.29, sold: 68, stock: 9, reorder: 10, trend: 2.3, color: "#fff5cc", initials: "FE" },
];

const ranges = { "7D": [38, 52, 47, 70, 62, 82, 76], "30D": [34, 44, 41, 50, 58, 54, 67, 62, 73, 66, 82, 79], "90D": [31, 38, 35, 43, 48, 45, 56, 52, 59, 64, 61, 70, 74, 68, 78, 84] };

function MiniSparkline({ positive }: { positive: boolean }) {
  const heights = positive ? [32, 45, 40, 62, 57, 74, 88] : [78, 65, 72, 54, 60, 46, 38];
  return <div className={`sparkline ${positive ? "up" : "down"}`} aria-hidden="true">{heights.map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}</div>;
}

export default function Home() {
  const [range, setRange] = useState<keyof typeof ranges>("30D");
  const [query, setQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "low">("all");
  const [selected, setSelected] = useState<Product | null>(null);
  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesSearch = `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(query.toLowerCase());
    return matchesSearch && (stockFilter === "all" || product.stock <= product.reorder);
  }), [query, stockFilter]);
  const chartValues = ranges[range];

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">N</span><span>Northstar</span></div>
        <nav aria-label="Main navigation">
          <p className="nav-label">WORKSPACE</p>
          <a className="nav-item active" href="#overview"><span>⌂</span> Overview</a>
          <a className="nav-item" href="#products"><span>▦</span> Products <b>326</b></a>
          <a className="nav-item" href="#analytics"><span>↗</span> Analytics</a>
          <a className="nav-item" href="#inventory"><span>◫</span> Inventory <i>4</i></a>
          <a className="nav-item" href="#customers"><span>◎</span> Customers</a>
          <p className="nav-label second">MANAGE</p>
          <a className="nav-item" href="#automations"><span>✦</span> Automations <em>Soon</em></a>
          <a className="nav-item" href="#integrations"><span>⌁</span> Integrations</a>
        </nav>
        <div className="sidebar-card"><span className="sidebar-card-icon">⌁</span><strong>Connect your POS</strong><p>Bring sales and stock data in automatically.</p><button>View connections</button></div>
        <div className="profile"><span className="avatar">MK</span><span><strong>Michael Kim</strong><small>Store owner</small></span><button aria-label="Open profile menu">•••</button></div>
      </aside>

      <section className="workspace" id="overview">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark">N</span> Northstar</div>
          <div className="store-picker"><span className="online-dot" /> Downtown Market <span className="chevron">⌄</span></div>
          <div className="top-actions"><label className="global-search"><span>⌕</span><input aria-label="Search dashboard" placeholder="Search anything..." /><kbd>⌘ K</kbd></label><button className="icon-button" aria-label="Notifications">♢<span /></button><button className="primary-button">＋ Add product</button></div>
        </header>

        <div className="dashboard-content">
          <div className="page-heading"><div><p className="eyebrow">TUESDAY, SEPTEMBER 1</p><h1>Good morning, Michael.</h1><p>Here’s how Downtown Market is performing today.</p></div><button className="date-button">Today <span>⌄</span></button></div>

          <section className="kpi-grid" aria-label="Key performance indicators">
            <article className="kpi featured"><div className="kpi-top"><span className="kpi-icon">$</span><small>Net sales</small><span className="change positive">↗ 12.5%</span></div><strong>$8,429.60</strong><p>vs. $7,493.20 yesterday</p><MiniSparkline positive /></article>
            <article className="kpi"><div className="kpi-top"><span className="kpi-icon violet">▤</span><small>Orders</small><span className="change positive">↗ 8.4%</span></div><strong>248</strong><p>23.4 items per hour</p><MiniSparkline positive /></article>
            <article className="kpi"><div className="kpi-top"><span className="kpi-icon amber">◈</span><small>Avg. order value</small><span className="change positive">↗ 3.8%</span></div><strong>$33.99</strong><p>vs. $32.74 yesterday</p><MiniSparkline positive /></article>
            <article className="kpi"><div className="kpi-top"><span className="kpi-icon coral">!</span><small>Low stock</small><span className="change negative">4 urgent</span></div><strong>12 <small>items</small></strong><p>Across 8 categories</p><MiniSparkline positive={false} /></article>
          </section>

          <section className="analytics-grid" id="analytics">
            <article className="panel sales-panel">
              <div className="panel-header"><div><h2>Sales overview</h2><p>Revenue performance over time</p></div><div className="range-picker">{(Object.keys(ranges) as (keyof typeof ranges)[]).map((item) => <button className={range === item ? "active" : ""} key={item} onClick={() => setRange(item)}>{item}</button>)}</div></div>
              <div className="chart-summary"><div><strong>$52,840</strong><span className="change positive">↗ 9.6%</span><p>Total revenue</p></div><div className="legend"><span><i className="legend-dot teal" /> This period</span><span><i className="legend-dot gray" /> Previous</span></div></div>
              <div className="bar-chart" aria-label={`Sales chart for ${range}`}><div className="grid-line"><span>$8k</span></div><div className="grid-line"><span>$6k</span></div><div className="grid-line"><span>$4k</span></div><div className="grid-line"><span>$2k</span></div><div className="bars">{chartValues.map((value, index) => <div className="bar-slot" key={`${range}-${index}`}><span className="bar previous" style={{ height: `${Math.max(value - 11, 12)}%` }} /><span className="bar current" style={{ height: `${value}%` }} /></div>)}</div></div>
              <div className="chart-labels"><span>Aug 4</span><span>Aug 11</span><span>Aug 18</span><span>Aug 25</span><span>Sep 1</span></div>
            </article>
            <article className="panel category-panel"><div className="panel-header"><div><h2>Sales by category</h2><p>Share of today’s revenue</p></div><button className="more-button">•••</button></div><div className="donut-wrap"><div className="donut"><div><strong>$8.4k</strong><span>Total</span></div></div></div><div className="category-list">{[['Grocery','31%','$2,613','teal'],['Beverages','24%','$2,023','blue'],['Fresh food','19%','$1,602','amber'],['Household','15%','$1,264','coral'],['Other','11%','$927','gray']].map(([name, percent, amount, tone]) => <div className="category-row" key={name}><span><i className={`legend-dot ${tone}`} />{name}</span><strong>{percent}</strong><small>{amount}</small></div>)}</div></article>
          </section>

          <section className="insight-strip"><span className="ai-glyph">✦</span><div><strong>Northstar insight</strong><p>Milk and bakery items are selling <b>18% faster</b> than usual. Reorder before 2 PM to avoid an estimated <b>$340 in missed sales.</b></p></div><button onClick={() => setStockFilter("low")}>Review items →</button><span className="ai-tag">AI PREVIEW</span></section>

          <section className="panel products-panel" id="products">
            <div className="panel-header product-header"><div><h2>Product performance</h2><p>Inventory and sales at a glance</p></div><div className="product-actions"><label><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" /></label><button className={stockFilter === "low" ? "filter active" : "filter"} onClick={() => setStockFilter(stockFilter === "all" ? "low" : "all")}>≡ {stockFilter === "low" ? "Low stock" : "Filter"}</button><button className="view-all">View all products →</button></div></div>
            <div className="table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Units sold</th><th>Stock</th><th>7-day trend</th><th /></tr></thead><tbody>{filteredProducts.map((product) => { const urgent = product.stock <= product.reorder; return <tr key={product.id} role="button" aria-label={`View insights for ${product.name}`} onClick={() => setSelected(product)} tabIndex={0} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(product)}><td><span className="product-image" style={{ background: product.color }}>{product.initials}</span><span><strong>{product.name}</strong><small>{product.sku}</small></span></td><td><span className="category-pill">{product.category}</span></td><td>${product.price.toFixed(2)}</td><td>{product.sold}</td><td><span className={`stock ${product.stock === 0 ? "out" : urgent ? "low" : "good"}`}><i />{product.stock === 0 ? "Out of stock" : urgent ? `${product.stock} left` : `${product.stock} in stock`}</span></td><td><span className={product.trend >= 0 ? "trend positive" : "trend negative"}>{product.trend >= 0 ? "↗" : "↘"} {Math.abs(product.trend)}%</span></td><td><button aria-label={`View ${product.name}`}>›</button></td></tr>})}</tbody></table>{filteredProducts.length === 0 && <div className="empty-state">No products match your filters.</div>}</div>
          </section>
        </div>
      </section>

      {selected && <div className="drawer-backdrop"><button className="backdrop-dismiss" onClick={() => setSelected(null)} aria-label="Close product details" /><aside className="product-drawer" aria-label={`${selected.name} insights`}><button className="drawer-close" onClick={() => setSelected(null)} aria-label="Close product details">×</button><span className="drawer-product" style={{ background: selected.color }}>{selected.initials}</span><p className="eyebrow">{selected.sku}</p><h2>{selected.name}</h2><span className="category-pill">{selected.category}</span><div className="drawer-metrics"><div><small>Price</small><strong>${selected.price.toFixed(2)}</strong></div><div><small>Units sold</small><strong>{selected.sold}</strong></div><div><small>On hand</small><strong>{selected.stock}</strong></div><div><small>7-day trend</small><strong className={selected.trend >= 0 ? "positive-text" : "negative-text"}>{selected.trend >= 0 ? "+" : ""}{selected.trend}%</strong></div></div><div className="stock-level"><div><span>Stock level</span><strong>{selected.stock} / {Math.max(selected.reorder * 3, 30)}</strong></div><span><i style={{ width: `${Math.min((selected.stock / Math.max(selected.reorder * 3, 30)) * 100, 100)}%` }} /></span><small>Reorder point: {selected.reorder} units</small></div><div className="drawer-insight"><span>✦</span><div><strong>AI observation</strong><p>{selected.stock <= selected.reorder ? `At the current sales pace, this item may sell out within ${selected.stock === 0 ? "the day" : "18 hours"}.` : "Stock coverage is healthy for the current sales pace."}</p></div></div><button className="drawer-action" disabled>Set up reorder automation <span>Next milestone</span></button></aside></div>}
    </main>
  );
}
