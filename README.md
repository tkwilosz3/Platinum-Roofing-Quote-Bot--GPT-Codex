# Platinum Roofing AI Quote Bot

A Next.js 14 + TypeScript single-page app that provides a ballpark roofing quote, embeds a GoHighLevel calendar, and sends lead details to GHL.

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in:
   - `GHL_WEBHOOK_URL`
   - `GHL_CALENDAR_IFRAME_URL`
   - `INTERNAL_NOTIF_EMAIL` (optional for future email notifications)
3. Run the development server:
   ```bash
   npm run dev
   ```

## Architecture
- App Router with client-side stepper (address → questions → results/contact)
- Pricing driven by `config/platinum_config.json`
- API routes:
  - `POST /api/measure` – stubbed roof measurement for Arizona addresses
  - `POST /api/quote` – computes replacement/repair ranges and risk level
  - `POST /api/lead` – posts a structured payload to the GHL webhook (or logs when unset)

## Re-theming for other roofers
Swap `config/platinum_config.json` with another config following the same shape to reuse the logic without code changes.
