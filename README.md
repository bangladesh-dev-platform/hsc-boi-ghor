# এইচএসসি বই ঘর — HSC Boi Ghor

A lightweight, mobile-first **COD order page** for HSC (class XI–XII) textbooks, with optional guides and future test papers. Built for ad/SMS traffic: a student picks their group, selects books, adds optional guides, enters an address, and confirms the order on WhatsApp. No shop, no account, no online payment.

> This is a **static** build. A small backend (`POST /api/orders`) can be added later without changing the UI.

## Features

- **Single-page order flow** — group → books → optional add-ons → address → review → WhatsApp confirm.
- **Group-aware catalog** — Science / Business Studies / Humanities, with subjects and "pick one" choices (e.g. ইতিহাস / বাংলাদেশের ইতিহাস ও বিশ্বসভ্যতা).
- **Optional add-ons** — guides as a collapsible accordion (master toggle + per-subject picks); test papers shown as **"শীঘ্রই আসছে"**.
- **Live totals** — running subtotal, delivery charge, and COD grand total, with a sticky total bar.
- **COD only** — fully cash on delivery; order is handed off to WhatsApp.
- **Bengali-first** — all UI and order message in Bengali; 64 districts grouped by division.
- **No dependencies** — plain HTML/CSS/vanilla JS, no build step.

## Project layout

```
hsc-boi-ghor/
├── index.html                 # the order page
└── assets/
    ├── css/style.css          # brand tokens + responsive styles
    ├── js/order.js            # catalog, state, rendering, totals, WhatsApp handoff
    └── img/favicon.svg
```

## Run locally

Any static server works:

```bash
python3 -m http.server 8090
# open http://localhost:8090/
```

## Configuration

All editable values live at the **top of `assets/js/order.js`**:

| What | Where | Notes |
|---|---|---|
| WhatsApp order/support number | `CONFIG.whatsapp` | International format, no `+` (e.g. `8801XXXXXXXXX`) |
| Delivery charge | `CONFIG.delivery` | Flat BDT amount |
| Free shipping threshold | `CONFIG.freeShippingOver` | `null` = off; e.g. `2000` |
| Categories & flags | `CATEGORIES` | Enable/disable guides, toggle the coming-soon test papers |
| Prices | `COMMON` / `GROUPS` items | `price` = textbook, `guidePrice` = guide (placeholders — replace with real values) |
| Districts | `DISTRICTS` | Division → districts shown in the address select |

## Order flow (how it works)

1. Student selects group, books, and optional guides.
2. Enters name, phone, district, address.
3. Page validates and builds a formatted order summary.
4. **Confirm on WhatsApp** opens `wa.me` with the full order prefilled; the owner confirms and ships.

There is **no server and no database** — orders arrive on WhatsApp. This is intentional for the first phase.

## Roadmap

- Wire `POST /api/orders` (Node + Express + SQLite, or any small service) and a minimal admin view.
- Order tracking by order number + phone.
- Test papers category (flag already scaffolded).
- Courier/API integration and optional online payment later.
- Meta Pixel / UTM capture for ad campaigns.

## Deployment

Static hosting anywhere (Cloudflare Pages, GitHub Pages, Nginx, etc.). Target domain: **hsc.banglade.sh**.

## Notes

- Guide prices are **placeholders**.
- Since guides/textbooks are sourced on demand, the guide section carries an edition disclaimer: *"পাবলিশার ও এডিশন স্টক অনুযায়ী ভিন্ন হতে পারে।"*
- No discounts are applied; the "full set" is simply the sum of selected items.
