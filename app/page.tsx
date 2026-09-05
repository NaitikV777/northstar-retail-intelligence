import Link from "next/link";
import HeroShader from "./components/HeroShader";
import "./landing.css";

export default function LandingPage() {
  return (
    <main className="landing-page">
      <section className="landing-hero" id="top">
        <HeroShader />
        <div className="hero-vignette" aria-hidden="true" />

        <nav className="landing-nav" aria-label="Landing navigation">
          <Link className="landing-brand" href="#top"><span className="landing-star small" />Northstar</Link>
          <div className="landing-links"><a href="#story">How it works</a><a href="#signals">Signals</a><a href="#roadmap">Roadmap</a></div>
          <Link className="nav-dashboard" href="/dashboard">Open dashboard <span>↗</span></Link>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="landing-eyebrow"><span /> RETAIL INTELLIGENCE, IN MOTION</p>
            <h1>See the store.<br /><em>Feel the signal.</em></h1>
            <p className="hero-lede">Northstar turns sales, stock, and product movement into one living view—so neighborhood retailers can act before opportunity becomes history.</p>
            <div className="hero-actions"><Link className="hero-primary" href="/dashboard">Enter the dashboard <span>↗</span></Link><a className="hero-secondary" href="#story">Explore the flow <span>↓</span></a></div>
            <div className="hero-proof"><span><i className="proof-live" /> Database connected</span><span>6 products tracked</span><span>4 stock signals</span></div>
          </div>

          <div className="hero-orbit" aria-label="Live retail metrics preview">
            <div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" />
            <div className="metal-star"><span /><i>N</i></div>
            <article className="orbit-card sales"><small>NET SALES</small><strong>$8,429.60</strong><span>↗ 12.5% today</span></article>
            <article className="orbit-card stock"><small>STOCK SIGNAL</small><strong>04</strong><span>items need attention</span></article>
            <article className="orbit-card orders"><small>ORDERS</small><strong>248</strong><span>587 units moving</span></article>
          </div>
        </div>

        <div className="hero-scroll" aria-hidden="true"><span /><small>SCROLL TO FOLLOW THE SIGNAL</small></div>
      </section>

      <section className="story-section" id="story">
        <div className="landing-section-head story-head">
          <p>FROM TRANSACTION TO DECISION</p>
          <h2>One continuous<br /><em>retail pulse.</em></h2>
          <span>Every sale changes the shape of your store. Northstar follows that movement and turns it into a decision you can make now.</span>
        </div>

        <div className="story-track">
          <div className="story-stage" aria-hidden="true">
            <div className="stage-grid" />
            <div className="signal-path"><i /><i /><i /></div>
            <div className="signal-node node-sale"><span>01</span><strong>SALE</strong><small>248 orders</small></div>
            <div className="signal-node node-stock"><span>02</span><strong>STOCK</strong><small>4 signals</small></div>
            <div className="signal-node node-action"><span>03</span><strong>ACTION</strong><small>Review ready</small></div>
            <div className="stage-core"><span className="landing-star" /><small>NORTHSTAR</small></div>
          </div>

          <div className="story-chapters">
            <article className="story-chapter"><span>01 / CAPTURE</span><h3>The sale lands.</h3><p>Orders and product movement enter one provider-neutral model, keeping the store—not the POS vendor—at the center.</p><div><b>+$33.99</b><small>Average order value</small></div></article>
            <article className="story-chapter"><span>02 / UNDERSTAND</span><h3>The pattern appears.</h3><p>Velocity, stock coverage, and product context reveal what needs attention while there is still time to act.</p><div><b>18% faster</b><small>Milk and bakery velocity</small></div></article>
            <article className="story-chapter"><span>03 / MOVE</span><h3>The next action is clear.</h3><p>Northstar prepares a safe, reviewable response—then keeps every decision and automation visible to the owner.</p><div><b>$340</b><small>Estimated missed sales avoided</small></div></article>
          </div>
        </div>
      </section>

      <section className="signals-section" id="signals">
        <div className="landing-section-head signals-head">
          <p>THE OPERATING VIEW</p>
          <h2>Calm on the surface.<br /><em>Alive underneath.</em></h2>
          <span>A focused workspace for the metrics that change today—not another wall of charts.</span>
        </div>

        <div className="dashboard-showcase">
          <div className="showcase-glow" aria-hidden="true" />
          <div className="showcase-nav"><span className="landing-star small" /><b>Northstar</b><i>Downtown Market</i><Link href="/dashboard">Open live view ↗</Link></div>
          <div className="showcase-grid">
            <article className="showcase-main"><div className="showcase-label"><span>REVENUE PULSE</span><i>30 DAYS</i></div><strong>$52,840</strong><small>Available period revenue <b>↗ 12.5%</b></small><div className="showcase-bars" aria-hidden="true">{[36,49,44,58,53,72,66,82,75,94].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></article>
            <article className="showcase-kpi violet"><span>ORDERS</span><strong>248</strong><small>587 units today</small></article>
            <article className="showcase-kpi mint"><span>AVG. ORDER</span><strong>$33.99</strong><small>↗ 3.8% today</small></article>
            <article className="showcase-alert"><div><span>STOCK SIGNAL</span><strong>Sea Salt Kettle Chips</strong><small>Out of stock · reorder point 15</small></div><b>Review →</b></article>
          </div>
        </div>
      </section>

      <section className="roadmap-section" id="roadmap">
        <div className="roadmap-orb" aria-hidden="true"><span className="landing-star" /></div>
        <div className="roadmap-copy"><p>BUILT TO GROW WITH THE STORE</p><h2>Start with clarity.<br /><em>Add intelligence carefully.</em></h2><span>The dashboard and retail data foundation are working now. POS sync, supplier automation, advanced analytics, and explainable AI arrive in controlled milestones.</span><Link className="hero-primary" href="/dashboard">Explore the working dashboard <b>↗</b></Link></div>
        <div className="roadmap-list">
          <article className="complete"><span>01</span><div><strong>Owner dashboard</strong><small>Live interface and product intelligence</small></div><i>COMPLETE</i></article>
          <article className="complete"><span>02</span><div><strong>Retail data foundation</strong><small>Persistent, provider-neutral records</small></div><i>COMPLETE</i></article>
          <article><span>03</span><div><strong>POS and supplier workflows</strong><small>Connection, sync health, and approvals</small></div><i>NEXT</i></article>
          <article><span>04</span><div><strong>Explainable AI</strong><small>Forecasts after reliable data</small></div><i>PLANNED</i></article>
        </div>
      </section>

      <footer className="landing-footer"><Link className="landing-brand" href="#top"><span className="landing-star small" />Northstar</Link><p>Retail intelligence, in motion.</p><span>© 2026 NORTHSTAR</span></footer>
    </main>
  );
}
