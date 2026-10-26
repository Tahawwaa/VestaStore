# رَوا — Persian fashion storefront

A responsive, RTL-first React + TypeScript storefront built with Vite, Tailwind CSS, Lucide, Framer Motion, and React Router. All storefront copy is Persian and prices use Persian digits and تومان.

## Run locally

Use Node.js 22.12+ (developed with Node 24).

```sh
npm install
npm run dev
```

Open the local address printed by Vite (usually `http://localhost:5173`).

```sh
npm run build    # strict TypeScript check and production bundle
npm run preview  # serve the production bundle
npm test         # cart, filtering, shipping, and validation tests
```

For deployment, serve `dist/` and rewrite non-asset requests to `index.html` so direct visits to nested routes work.

## Pages and interactions

- `/`: editorial home, category links, filterable arrivals, best sellers, and newsletter preview.
- `/products`: URL-backed search, category, size, color, price, stock, new-arrival, sale, and favorites filters; four sort modes; mobile filter drawer.
- `/products/:id`: touch gallery, close-up view, full-screen preview, size guide, variant validation, quantity, saved favorites, accordions, and related products.
- `/checkout`: Persian/Arabic digit-aware validation, delivery choices, discount code `RAVA10`, order summary, and local success confirmation.
- Cart: variant-aware quantities, free shipping threshold, removal, totals, local persistence, and keyboard-accessible drawer.

## Architecture

`src/types` defines the catalog and cart contracts. `src/data/products.ts` is the typed catalog. `src/providers/CartProvider.tsx` owns cart and favorites state. Stored cart data is validated and resolved against current catalog prices on hydration. `src/utils` contains independently tested business rules. `src/components` contains reusable UI and feature components; `src/pages`, `src/layouts`, and `src/routes` compose them. Secondary pages are lazy loaded.

Vazirmatn is bundled locally. All final photographs are project-local JPEGs in `public/images/`; no image-host or font-host request is required at runtime. The image provenance and generation prompt set are documented in `ASSETS.md`. Gallery close-ups use a CSS crop of the original photo rather than depicting an inconsistent second product.

## Preview boundaries

This is a complete frontend preview. Checkout, newsletter, ratings, inventory, delivery promises, and order numbers are demonstration data. No payment is collected, no email is sent, and no physical order is created. Customer form data remains in component memory. Only cart selections and favorites are stored in `localStorage`.

Before connecting a real storefront, replace catalog data and imagery with actual inventory, verify product dimensions and size guides, and implement server-authoritative pricing, stock validation, order persistence, newsletter delivery, and payment integration.

## Accessibility

Semantic RTL markup, visible focus states, labeled inputs and icons, modal focus trapping and restoration, Escape dismissal, background inertness, live cart feedback, reduced-motion support, and responsive controls are included. Automated business-rule tests complement interactive desktop/mobile browser checks; they are not a formal accessibility certification.
