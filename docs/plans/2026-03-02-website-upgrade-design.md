# Imagine Me King Website Upgrade — Design Document

**Date:** 2026-03-02
**Updated:** 2026-03-04
**Status:** Implemented

## Overview

Upgraded the Imagine Me King single-page website with merch integration (Printful API), custom shows section, redesigned social buttons, Google Analytics, and a split contact section — while keeping the cosmic dark theme.

## What Was Built

### Page Order (top to bottom)

1. **Nav bar** — Logo, Videos, About, Listen, Shows + "Merch" button + "Book Us" button
2. **Hero** — Band photo, name, tagline, social links, Book Us CTA
3. **Videos** — YouTube embeds (stacked single-column, larger, 16:9 ratio)
4. **About** — Band story + live performance photo
5. **Listen** — Streaming platform links (desktop only; replaced by Linktree buttons on mobile)
6. **Shows** — Custom show cards from `shows.json` with RSVP, directions, flier support
7. **Merch** — "IMK Merch" section with Printful API product display + fallback card
8. **Contact** — "Let's Connect" with dual CTAs: "Book Us" + "Say Hey"
9. **Footer** — Logo, social icons, copyright, "Built by Mike Miller Development" credit

### Shows Section

- Custom-styled show cards matching the cosmic theme
- Each card: date (month/day/weekday), venue, city, note, RSVP button, directions link
- Flier image support (add images to `fliers/` folder)
- Data source: `shows.json`

**shows.json format:**
```json
[
  {
    "date": "2026-03-20",
    "venue": "Lucky Star Brewery and Cantina",
    "city": "Miamisburg, OH",
    "flier": "",
    "tickets": "",
    "rsvp": "https://www.bandsintown.com/e/107993857",
    "directions": "https://maps.google.com/?q=Lucky+Star+Brewery+and+Cantina+Miamisburg+OH",
    "note": "8:00 PM"
  }
]
```

### Merch Integration

- **Printful** (not Printify) as the merch platform
- Netlify Function (`printful-products.js`) securely fetches product data
- Products display as image cards with name and price
- Falls back to "Shop Coming Soon" card if API not configured
- API key stored in Netlify environment variables as `PRINTFUL_API_KEY`

### Social Buttons

- **Desktop:** Modern rounded rectangles (8px border-radius) with icon + label
- **Tablet:** Slightly smaller version of desktop
- **Mobile:** Clean circular icon-only buttons (Linktree style)

### Contact Section

- Dual CTAs: "Book Us" (gradient, with subject line) + "Say Hey" (outline)
- Both link to mikeandsmitty@gmail.com
- Email displayed as text below buttons

### Google Analytics

- GA4 placeholder snippet in `<head>`
- Replace `G-XXXXXXXXXX` with real Measurement ID when ready

## Files Structure

```
Imagine Me King/
  index.html                        — main website
  shows.json                        — show dates data
  news.json                         — manual announcements
  fliers/                           — show flier images
  news/                             — news images
  netlify/
    functions/
      printful-products.js          — Printful API integration
  netlify.toml                      — build config + redirects
  docs/plans/                       — design docs (this file)
  imagine-me-king-band-dayton-ohio.jpg
  imagine-me-king-live-performance.jpg
  og-image.jpg
```

## Not Yet Implemented

- Instagram feed (requires Instagram API setup)
- Spotify full artist player embed (currently uses streaming link pills)
- Bandsintown API integration (for auto-populating shows)
- Custom Printful store domain (shop.imaginemeking.com)
- News section on the page (news.json exists but no section renders it yet)

## Technical Notes

- shows.json and news.json loaded client-side via fetch()
- Printful products fetched via Netlify Function (server-side, key hidden)
- All sections use reveal/scroll animation pattern
- Mobile layout uses CSS-only responsive redesign (no separate templates)
