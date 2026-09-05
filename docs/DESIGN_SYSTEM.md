# Northstar visual system

## Direction

Northstar uses an expressive **aurora operations** direction: luminous violet and cyan gradients, translucent analytical surfaces, crisp data contrast, and motion that communicates live activity without distracting from decisions.

The application should feel more like a modern retail operating system than a generic admin template. Product data, freshness, risk, and actions remain visually dominant.

## Typography

- **Syne** — display headings, KPI values, panel titles, and the Northstar wordmark
- **Plus Jakarta Sans** — navigation, tables, labels, controls, and long-form interface copy

Both fonts are loaded through the framework font system, so the deployed application does not depend on a runtime request to a font CDN.

## Core palette

| Role | Value | Use |
|---|---|---|
| Midnight | `#171329` | Navigation and high-contrast surfaces |
| Violet | `#7358f6` | Primary actions and sales emphasis |
| Cyan | `#2dcad1` | Freshness, movement, and secondary gradients |
| Coral | `#ff6c86` | Urgent inventory risk |
| Aurora canvas | `#f3f0ff` | Main page foundation |
| Ink | `#151328` | Primary readable text |

Status colors must not be communicated by color alone; labels and icons provide the same meaning.

## Surface and layout rules

- Use translucent white panels over the aurora canvas, with subtle borders and restrained blur.
- Keep chart backgrounds quiet so the data remains legible.
- Use gradients for hierarchy and momentum, not on every element.
- Maintain the fixed navigation model on desktop and the compact top bar on mobile.
- Product tables remain information-dense and horizontally scrollable on small screens.

## Motion

- Ambient gradient forms move slowly behind the dashboard.
- The signal ticker reinforces that the data surface is active.
- Major dashboard regions reveal as they enter the viewport when scroll-driven animations are supported.
- A thin progress line shows the reader's position through the dashboard.
- Hover lift is reserved for interactive cards and actions.
- `prefers-reduced-motion` disables ambient, ticker, scroll, and progress animations.

Motion should clarify hierarchy or system activity. It must never delay access to inventory warnings or required controls.

## Using external GitHub interfaces

External repositories can be useful references, but Northstar should adopt them selectively:

1. Confirm the repository license permits the intended use.
2. Check compatibility with the existing React, TypeScript, and Sites runtime.
3. Reuse individual interaction or layout ideas instead of replacing the working data architecture.
4. Remove unused dependencies and generic template content.
5. Restyle imported components using Northstar's typography, palette, motion, responsive, and accessibility rules.
6. Run the complete build, lint, and interaction tests after integration.

Record the source repository and license in this document before shipping any copied or substantially adapted component.
