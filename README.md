# Exporium — China ➜ Bangladesh Footwear E-Store

A fully responsive single-page storefront for Exporium, a shoe and sneaker sourcing brand specializing in China-to-Bangladesh logistics. Built with vanilla HTML, CSS, and JavaScript to keep deployment lightweight and globally compatible.

## Features

- Multi-page experience: landing (`index.html`), full catalog (`catalog.html`), dynamic product preview (`product.html`), and login/sign-up intake (`auth.html`).
- Hero section, KPI metrics, and featured drop messaging hydrate from live `/api/public/settings` data.
- Catalog filters (segment, audience, brand, search, sort) plus buy-intent + cart/favorites tracking that pre-fills sourcing forms.
- Product detail page with gallery, specs, logistics breakdown, and inline order form.
- Brand index flyout + global search suggestions to jump to SKUs or filter by brand from any page.
- Wholesale cart + favorites dashboard sections with iconography for downstream ops, plus device-driven dark/light styling.
- Wishlist/favorites UI stays hidden until a user signs in, keeping the guest experience simple.
- Supply-chain program timeline, responsive CTA forms, and a "Latest updates" feed that pulls the newest `/api/public/posts` entries.

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
scripts/cms.js      # Fetches live settings + posts for the landing page
scripts/main.js     # Navigation, filtering, rendering, favorites/cart, and buy-intent logic
server/             # Express-based admin API (auth, posts, settings, uploads)
```

### Admin API (server/)

The `server` folder hosts a Render-ready Express app that secures the admin dashboard work:

- Auth (`POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`) via JWT, with hashed admin credentials.
- Posts CRUD (`/api/posts`) for managing catalog/news entries.
- Site-wide settings store (`/api/settings`).
- Image uploads (`/api/uploads`) storing files on disk (swap in S3 later).

#### Quick start

```bash
cd server
cp .env.example .env   # add DATABASE_URL, JWT_SECRET, etc.
npm install
psql "$DATABASE_URL" -f db/migrations.sql   # create tables
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=secret npm run seed
npm run dev
```

Set these env vars locally or on Render:

- `PORT` — defaults to `4000`.
- `DATABASE_URL` — Postgres connection string.
- `JWT_SECRET`, `JWT_EXPIRES_IN` — token security.
- `CORS_ORIGINS` — comma-separated list of allowed origins (e.g., GitHub Pages URL).
- `UPLOAD_DIR` — where uploaded images land (persistent disk/S3 recommended in prod).
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` — used only by the `npm run seed` helper.

Render deploy hints:

- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm run start`
- **Instance Type**: Hobby → Free (scales later)
- Add environment variables under Render > Web Service > Environment.

### Frontend API configuration

- `scripts/config.js` sets the public API base (`https://exporium-store.onrender.com` in production) and the local storage keys used for auth tokens/profile data. Update `apiBaseUrl` if you deploy the backend elsewhere.
- `auth.html` now posts directly to `/api/auth/register` + `/api/auth/login` and stores the returned JWT client-side so subsequent fetch calls (or the admin UI) automatically include the `Authorization` header.
- The header’s user menu reflects the stored session and surfaces a Sign out action that clears the local token/profile.

### Admin dashboard

- `admin.html` + `scripts/admin.js` provide a secure, token-gated control center for posts, global settings, and media uploads.
- Workflow:
	1. Sign in through `auth.html` to seed your JWT/token.
	2. Open `/admin.html` and click **Refresh session** if needed.
	3. Use the Posts table and composer to create, edit, or delete records backed by `/api/posts`.
	4. Update JSON settings payloads via `/api/settings` and upload assets through `/api/uploads` (with delete helper).
- The overlay guard blocks actions until a valid token exists, and the user menu still exposes Sign out for clearing stored credentials.

### Settings JSON cheatsheet

`scripts/cms.js` looks for a few optional keys inside the `/api/settings` payload. Use the admin dashboard to save JSON shaped like this:

```json
{
	"hero": {
		"headline": "Premium sneakers delivered with supply-chain certainty.",
		"subline": "China ➜ Bangladesh logistics with transparent landed costs.",
		"metrics": [
			{ "label": "Average factory confirmation", "value": "48h" },
			{ "label": "Vetted manufacturing partners", "value": "12+" },
			{ "label": "Avg. landed cost savings", "value": "7.5%" }
		]
	},
	"featuredDrop": {
		"title": "Flux Glide V2",
		"price": "Starting at $38 / pair",
		"notes": {
			"moq": "MOQ 150 pairs",
			"lead": "Lead time 9 days",
			"qc": "QC by Exporium Dhaka"
		}
	},
	"stats": {
		"onTime": "97.4%",
		"customs": "12 hrs",
		"compliance": "9.2 / 10",
		"damage": "< 0.4%"
	}
}
```

- `/api/public/settings` returns the object above, which is rendered on `index.html`.
- `/api/public/posts` powers the “Latest updates” cards by reading published posts.
- Any keys you omit safely fall back to the defaults baked into the markup.

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
