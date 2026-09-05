import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(new URL(pathname, "http://localhost"), { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the immersive Northstar landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Northstar — Retail Intelligence<\/title>/i);
  assert.match(html, /See the store\./);
  assert.match(html, /Feel the signal\./);
  assert.match(html, /Enter the dashboard/);
  assert.match(html, /One continuous/);
  assert.match(html, /Calm on the surface/);
  assert.match(html, /Add intelligence carefully/);
  assert.match(html, /href="\/dashboard"/);
});

test("renders the Northstar retail dashboard", async () => {
  const response = await render("/dashboard");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Good morning, Michael/);
  assert.match(html, /Sales overview/);
  assert.match(html, /Product performance/);
  assert.match(html, /Organic Whole Milk/);
  assert.match(html, /AI PREVIEW/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);
});

test("labels future capabilities honestly", async () => {
  const response = await render("/dashboard");
  const html = await response.text();
  assert.match(html, /Connect your POS/);
  assert.match(html, /Automations/);
  assert.match(html, /Soon/);
});
