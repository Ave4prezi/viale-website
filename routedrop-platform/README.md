# RouteDrop Platform Beta (separate from public demo)

This is a real account/database/Stripe Connect architecture prepared for deployment in a **separate Render web service**. It does not modify the existing RouteDrop static demo or Viale main branch.

## Included
- Customer registration and sign-in, password hashing with bcrypt.
- Business-owner registration with separate business profiles.
- Persistent users, sessions, services, and booking state in Postgres when DATABASE_URL is supplied.
- Listing creation by business accounts; public unbooked slot discovery.
- Stripe Connect Express seller onboarding and destination charges via hosted Stripe Checkout.
- 8% application fee; payment state finalized **only by verified Stripe webhook**.
- Session cookies (HttpOnly, Secure on HTTPS), origin and CSRF checks, API rate limits, parameterized SQL queries, row-locked booking allocation, Stripe event idempotency and basic ownership enforcement.

## Deploy on Render
- Root repo: Ave4prezi/viale-website
- Branch: routedrop-platform-beta
- Runtime: Node
- Build: cd routedrop-platform && npm install --omit=dev && node --check server.js && node --check public/app.js
- Start: node routedrop-platform/server.js
- Plan: free for testing only (cold starts/usage limits)
- Required environment variables (set **in Render only**, never commit secrets):
  - NODE_ENV=production
  - PUBLIC_URL=https://<actual-new-render-domain>
  - DATABASE_URL=<separate, production-backed RouteDrop Postgres connection URI>
  - STRIPE_SECRET_KEY=<Stripe platform secret API key>
  - STRIPE_WEBHOOK_SECRET=<endpoint signing secret>

Register a Stripe webhook endpoint at https://<actual-new-render-domain>/api/stripe/webhook:
  checkout.session.completed
  checkout.session.async_payment_succeeded
  checkout.session.async_payment_failed
  checkout.session.expired

**Do not use another project's database.** Render free Postgres expires after 30 days and does not provide backup. The workspace currently has another free database, so RouteDrop requires its own paid persistent database or an independently provisioned external database.

## Security and operational release blockers
**Not production-ready.** Do not invite real customers, accept payments, or collect personal data yet. Before production launch:
- Add and test email address verification, password reset, account deletion/retention, antifraud controls, and transactional email confirmations.
- Conduct a security review including rate limits on sign-up, session expiry, payment races and webhook retry reconciliation.
- Add privacy policy, marketplace terms, refund/cancellation workflows, dispute handling, taxes and Connect merchant-of-record policy.
- Review payment settlement and application-fee economics with Stripe (destination charges can leave platform liable for fees/refunds/disputes).
- Add logs, monitoring, backups and database migration management; complete end-to-end tests with Stripe test keys and two connected test businesses.
- Confirm Stripe Connect eligibility and platform account requirements.

## Status
When DATABASE_URL is absent, GET /health reports "database":"not configured" and UI is deliberately locked in setup_required mode. Stripe payment endpoints remain disabled without both STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET. No actual customer charges can be collected through this beta until all required secrets are installed and external configuration is verified.
