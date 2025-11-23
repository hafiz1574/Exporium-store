# Exporium — China ➜ Bangladesh Footwear E-Store

A fully responsive single-page storefront for Exporium, a shoe and sneaker sourcing brand specializing in China-to-Bangladesh logistics. Built with vanilla HTML, CSS, and JavaScript to keep deployment lightweight and globally compatible.

## Features

- Multi-page experience: landing (`index.html`), full catalog (`catalog.html`), dynamic product preview (`product.html`), and login/sign-up intake (`auth.html`).
- Hero section with KPI metrics, logistics lane snapshot, and user menu for wholesale/account actions.
- Catalog filters (segment, audience, brand, search, sort) plus buy-intent + cart/favorites tracking that pre-fills sourcing forms.
- Product detail page with gallery, specs, logistics breakdown, and inline order form.
- Brand index flyout + global search suggestions to jump to SKUs or filter by brand from any page.
- Wholesale cart + favorites dashboard sections with iconography for downstream ops, plus device-driven dark/light styling.
- Supply-chain program timeline, retailer story filters, subtle transitions, and responsive CTA forms.

## Tech Stack

- Semantic HTML5
- Modern CSS (flexbox, grid, custom properties)
- Vanilla JavaScript for interactivity (filters, menu, dynamic year)

## Project Structure

```
index.html          # Main landing page
catalog.html        # Dedicated catalog with filters and sorting
product.html        # Dynamic product preview + order form
auth.html           # Login / sign-up workspace intake
styles/main.css     # Global styles, animations, and theme rules
scripts/data.js     # Centralized demo product dataset
scripts/main.js     # Navigation, filtering, rendering, favorites/cart, and buy-intent logic
```

## Getting Started

1. Clone or download the repository.
2. Open `index.html` directly in your browser **or** start a lightweight server (e.g. `npx serve .`).
3. Explore `catalog.html` for filter interactions and `product.html?id=lotus-drift` for the detail preview.
4. Customize product data inside `scripts/data.js`; the UI updates automatically.

## Customization Tips

- Add or edit SKUs in `scripts/data.js`; include fields like `gallery`, `features`, and `logistics` to power all pages.
- Update hero metrics, logistics stats, and story quotes to match current operations.
- Replace Unsplash placeholders with brand imagery and wire CTA/order forms to your CRM or email endpoint.
- Extend the buy-intent/cart flow by swapping the storage logic in `scripts/main.js` with real authentication, ERP cart syncing, or CRM automations.

## License

This project is provided as-is for Exporium internal use. Add licensing details if you plan to redistribute.
