# nolla

*make staying in feel better.*

A one-product storefront for the **Nolla Nuv™ Velvet Blanket**: 6 colours × 3 sizes, UK and US pricing, and a free Nimbus™ cloud pillow with every blanket.
Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS. Square checkout (UK, GBP) is built in.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # TypeScript only
```

Deploy by pushing to the GitHub repo connected to Vercel. Environment variables are in `.env.example`.

## Pages

| Route | What it is |
| --- | --- |
| `/` | The whole store: hero → purchase section (`#shop`) → free gift (`#gift`) → staying in → benefits → texture (`#fabric`) → size guide (`#size-guide`) → our story (`#story`) → reviews (hidden until genuine) → FAQ (`#faq`) → final CTA |
| `/checkout` | Delivery details, then Square payment |
| `/checkout/success` | Thank-you page (Square redirects here) |
| `/faq`, `/contact`, `/shipping-returns`, `/privacy`, `/terms` | Supporting pages |
| `/shop`, `/products/*` | Permanently redirect to `/#shop`, so old links and ads still land on the product |

## Where to change things

| To change… | Edit |
| --- | --- |
| **Prices** (UK and US, per size) | `data/product.ts` → `SIZES[].prices` (pence / cents) |
| **Reference ("regular") prices** | `data/product.ts` → `SIZES[].referencePrices` (per storefront; `null` = none shown) |
| **Limited-time offer on/off, wording** | `data/product.ts` → `PROMOTION` |
| Colours, swatches, which photos each colour uses | `data/product.ts` → `COLOURS` |
| Default colour/size shown first | `data/product.ts` → `DEFAULT_SELECTION` |
| **Free pillow rule** (one per blanket, or one per order) | `data/product.ts` → `GIFT.mode` |
| Storefronts: currency, delivery wording, whether checkout is open | `data/regions.ts` |
| Announcement bar | `data/site.ts` → `announcement` |
| Delivery methods charged at checkout (GBP) | `data/site.ts` → `shippingRegions` |
| Section copy (hero, gift, moments, benefits, story, final CTA, product details) | `data/content.ts` |
| FAQ | `data/faqs.ts` |
| Reviews | `data/reviews.ts` (genuine reviews only) |
| Privacy, terms, shipping & returns | `data/legal.ts` |
| Navigation, footer links, contact email, logo | `data/site.ts` |
| Colours, type scale | `tailwind.config.ts`; fonts in `app/fonts.ts` |

## How it works

- **One product, variants not pages.** Colour and size are options of a single product. Changing size keeps the colour and vice versa (`components/product/SelectionProvider.tsx`), and the purchase panel, sticky bar and texture section all share that choice.
- **Regional pricing.** `components/store/RegionProvider.tsx` holds the storefront (UK £ / US $), remembers it on the device, and accepts `?region=us` or `?region=uk` in a link (useful for ads). Every price is read from `data/product.ts` for the current storefront. The bag stores colour, size and quantity only, never a price, so switching storefront re-prices everything at once. Prices fade in once the saved storefront has loaded, so US visitors don't see £ flash first.
- **The bag** (`components/cart/*`, `lib/cart.ts`) persists to `localStorage`, syncs across tabs, and supports quantity changes and removal. The free pillow is *derived* from the blankets: it can't be added, removed, edited or charged.
- **Checkout** (`app/api/checkout/route.ts`, `lib/order.ts`, `lib/square.ts`): the server re-prices the bag from `data/product.ts`, rejects anything it doesn't recognise, adds the free pillow line(s) at £0, and creates a Square payment page. Line names include the supplier's colour name (e.g. "Pink (Powder Pink)") so orders are unambiguous to fulfil.

## Before launch: things to confirm

- **Reference price.** £119.99 is shown struck through next to £89.99 on the 200 × 230 cm size, as briefed. UK rules (CMA guidance, DMCC Act 2024) expect a "regular price" to be one the product was genuinely sold at for a meaningful period. Keep it only if that's true; otherwise set `referencePrices.uk` to `null` or change `PROMOTION.referenceLabel`.
- **Black.** The "Black" option uses the photos previously labelled Charcoal (it photographs as a deep charcoal). Check against a sample.
- **Care instructions** are a placeholder (`data/content.ts` → `care`, `data/faqs.ts` → `care`). Add the supplier's confirmed instructions.
- **International delivery times** aren't confirmed (`data/site.ts`, marked PLACEHOLDER). No US delivery times are promised anywhere.
- **Reviews.** The section is built and hidden. Add genuine reviews to `data/reviews.ts`, or pass reviews from a review app to `<ReviewSection reviews={…} />`, and it appears automatically.
- **Logo.** The serif wordmark is the same one the current site uses. To use a logo file, set `site.logo.src`.

## US checkout: what's needed

The UK storefront takes real payments today. The US storefront shows the correct USD prices everywhere and lets people build a bag, but checkout is closed (`data/regions.ts` → `us.checkout.enabled: false`). The bag and `/checkout` explain this and offer to switch to the UK store, which can deliver to the US in GBP with international delivery.

This is because a Square location charges in its own currency, and the current location is GBP. To take USD payments:

1. Set up a checkout that can charge in USD: a Square account/location in the US, or a multi-currency provider (e.g. Stripe or Shopify Markets).
2. Configure US delivery methods (priced in USD) alongside `shippingRegions` and pass the right ones by storefront in `lib/order.ts` (it currently refuses non-GBP orders on purpose).
3. In `lib/square.ts`, choose the location ID by `order.currency` (money amounts already use `order.currency`).
4. Set `REGIONS.us.checkout.enabled = true`.

## Free gift: what's automatic, and what isn't

- **Automatic:** the pillow appears in the bag, on the checkout summary and as £0 line(s) in the Square order (one per blanket, per `GIFT.mode`). If Square ever rejects a £0 line, the order still goes through and the payment note says "+ FREE Nimbus cloud pillow ×N".
- **Still manual:** fulfilment. Square doesn't send orders to CJdropshipping. Whoever fulfils needs to include the pillow (CJ SKU `CJJJJFZT00537-White-25cm`) with each blanket. To automate this, connect Square orders to CJ (via a Square → CJ app or a small webhook that creates the CJ order with the pillow line added).

## Square environment variables

`SQUARE_ENVIRONMENT` (`sandbox` / `production`), `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `NEXT_PUBLIC_SITE_URL`, `SUPPORT_EMAIL`. Without them, checkout shows "Checkout isn’t connected yet" and never pretends to take payment.

## What changed from the previous site

- Removed: the Nest™ bundle, the Nook™ hooded blanket, the multi-product shop, bundle upsells, and the 10% quiz popup (it recommended the retired products). `NOLLA10` still works at checkout for anyone who already has it.
- Kept and adapted: Square checkout, delivery-details page, discount codes, Klaviyo sign-up (now in the footer), legal pages, fonts and brand palette.

## Accessibility and motion

Real radio groups for colour and size, labelled dialogs (bag, menu, photo viewer, size guide) with Escape to close and focus returned, a skip link, visible focus, polite announcements when the bag changes, and 44px touch targets in the purchase area. All motion is switched off for `prefers-reduced-motion`.
