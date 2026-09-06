# Northstar visual system

## Direction

Northstar uses a two-speed **aurora operations** direction: an immersive, cinematic landing page introduces the product, while a lighter analytical workspace keeps operational decisions fast. Both layers share luminous violet and cyan gradients, translucent surfaces, crisp data contrast, and motion that communicates live activity without distracting from decisions.

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

- The hero solar system represents Northstar coordinating sales, inventory, products, suppliers, orders, and insights. It is a visual metaphor, not an astronomical simulation or a claim that future integrations already operate.
- A dedicated React Three Fiber scene renders the sun and six planets. Orbits pause when the scene is faded out, outside the viewport, the tab is hidden, or reduced motion is requested. A scroll-position opacity curve fades the entire figure and reverses on upward scrolling; it does not intercept scrolling.
- The landing experience uses one fixed WebGL shader canvas across every section; it pauses when the tab is hidden and respects reduced-motion preferences.
- A sticky signal map and view-timeline reveals turn the landing page into a scroll-led product story.
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

## External implementation references

- [`@shadergradient/react` 2.4.20](https://github.com/ruucm/shadergradient) — MIT. Used to render the hero's WebGL gradient environment.
- [`@react-three/fiber` 9.7.0](https://github.com/pmndrs/react-three-fiber) and Three.js 0.185.1 — MIT. Runtime foundation for the shader canvas.
- `camera-controls` 3.1.2 and `three-stdlib` 2.36.1 — MIT. Compatible peer packages used by the WebGL stack.
- [`paper-design/liquid-logo`](https://github.com/paper-design/liquid-logo) informed the dimensional identity exploration only. Its source was not copied or adapted because it uses the PolyForm Shield license.
- [`dashersw/liquid-glass-js`](https://github.com/dashersw/liquid-glass-js) was evaluated but is not installed or used in the shipped interface.

The solar system workflow diagram, layout, and animation system are original Three.js, CSS, and React work for this project. The earlier metallic hero symbol has been replaced; the small navigation wordmark remains.
