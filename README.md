# LUXE WED

**Every Love Story Deserves Its Own Website.**

A free wedding website builder. Couples fill in an 8-step form, pick one of six designs,
fine-tune it in the Design Studio with a live preview, and get a link to share on
WhatsApp or as a QR code. Guests open the link and RSVP from their own WhatsApp or email.

There is no server, no database and no sign-up. It is a static site hosted on GitHub Pages.

## How it works

- **The website lives in the link.** The share link looks like
  `https://<user>.github.io/luxe-wed/wedding/#meera-and-aarav.<data>`. The part after `#` is
  the whole wedding, compressed (deflate + base64url). Browsers never send that part to a
  server. Values equal to the defaults are left out to keep the link short.
- **The draft is saved in the browser** (`localStorage`, key `luxewed:draft:v1`) as you type.
- **Editing again:** open the link and press "Edit this website" at the bottom. That works on
  any device, so the link is also the backup.
- **RSVPs** open a ready-written message to the couple's WhatsApp number (`wa.me`) or email
  (`mailto:`). The guest presses Send in their own app.
- Everything read from a link is checked: colours must be hex, choices must come from the
  allowed lists, and text lengths are limited (`src/lib/share.ts`).

## Limits (by design, because nothing is stored)

- Every change makes a new link. People with an old link keep seeing the old version.
- A shared website cannot be taken down; you can only stop sharing its link.
- There is no RSVP dashboard. Replies arrive as WhatsApp or email messages.
- WhatsApp shows a generic preview for the link, not the couple's names.
- A very detailed website makes a long link and a dense QR code. Print the QR at least 4 cm wide.
- The draft is kept per browser. Clearing site data removes it (the shared link still works).

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # unit tests (vitest)
npm run lint
npm run typecheck
```

## Deploy to GitHub Pages

The site is exported as static files (`output: "export"` in `next.config.ts`). The base path
must match the repository name.

```bash
npm run build:pages               # builds into out/ with base path /luxe-wed
touch out/.nojekyll               # lets Pages serve the _next folder
```

Then publish `out/` to the `gh-pages` branch. In the repository settings, set
Pages → Source → "Deploy from a branch" → `gh-pages` / root.

If the repository has a different name, change `/luxe-wed` in the `build:pages` script.

## Project layout

```
src/app/            pages: home, designs, create (wizard), studio, share, wedding (guest view)
src/components/     marketing, dashboard (builder), site (wedding themes, RSVP form)
src/lib/share.ts    link encoding, decoding and checks
src/lib/draft.ts    browser draft storage
src/app/site.css    the six themes
tests/              unit tests
```
