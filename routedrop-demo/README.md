# RouteDrop public demo
This is a self-contained interactive preview of the RouteDrop marketplace, stored on the `routedrop-preview` branch. The original `main` branch of `viale-website` is not changed.

- Entry point: `routedrop-demo/index.html`.
- Render static site: build command `node routedrop-demo/build-icons.cjs` and publish directory `routedrop-demo`.
- Offline support: service worker and PWA manifest. Icons generated at build time.
- **Demo only:** Sample businesses, simulated reservations, no real accounts or payments. Information entered stays in the browser's local storage and is not synced across devices.
