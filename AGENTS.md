# AGENTS.md — Livnium Docs Plan (for Codex)

## Goals

1. Scaffold a Docusaurus site `livnium-docs`.
2. Generate `dartdoc` HTML from `livnium-core` and mount at `/api/`.
3. Add pages + navbar link + DartPad embeds.
4. Automate builds + deploy to GitHub Pages on tag/main.

> Assumes sibling repos:
>
> ```
> livnium/
> ├─ livnium-core/   # Dart package
> └─ livnium-docs/   # Docusaurus site
> ```

---

## 0) Verify toolchain (non-interactive)

```bash
node -v
npm -v
dart --version
```

---

## 1) Scaffold the docs site

```bash
cd ..                       # from livnium-core to root livnium/
npx create-docusaurus@latest livnium-docs classic --package-manager npm --skip-install
cd livnium-docs
npm i
```

---

## 2) Generate API docs & mount under `/api`

Create a script that builds dartdoc and syncs it into Docusaurus static assets.

**File:** `scripts/sync_api.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CORE="$ROOT/../livnium-core"
DOCS="$ROOT"

# 1) Build dartdoc
cd "$CORE"
dart pub get
dart doc . --output build/api

# 2) Sync into docusaurus static dir
mkdir -p "$DOCS/static/api"
rsync -a --delete "$CORE/build/api/" "$DOCS/static/api/"
echo "API synced to livnium-docs/static/api/"
```

```bash
chmod +x scripts/sync_api.sh
```

Add NPM scripts.

**Edit:** `package.json` → `"scripts"`

```json
{
  "scripts": {
    "start": "docusaurus start",
    "build": "docusaurus build",
    "serve": "docusaurus serve",
    "deploy": "docusaurus deploy",
    "sync:api": "bash scripts/sync_api.sh",
    "build:site": "npm run sync:api && npm run build"
  }
}
```

---

## 3) Link API in navbar + add docs pages

**Edit:** `docusaurus.config.js` (only the shown keys)

```js
// ...
title: 'Livnium Core',
tagline: 'Spatial Operating System for Symbolic Computation',
url: 'https://<YOUR_GH_USERNAME>.github.io',
baseUrl: '/livnium-docs/', // If deploying to <user>.github.io/livnium-docs
organizationName: '<YOUR_GH_USERNAME>',
projectName: 'livnium-docs',
themes: ['@docusaurus/theme-live-codeblock'],
themeConfig: {
  navbar: {
    title: 'Livnium',
    items: [
      { to: '/docs/intro', label: 'Docs', position: 'left' },
      { to: '/api/index.html', label: 'API', position: 'left' },
      { href: 'https://github.com/<YOUR_GH_USERNAME>/livnium-core', label: 'GitHub', position: 'right' }
    ],
  },
},
staticDirectories: ['static'],
// ...
```

**Create:** `docs/intro.md`

````md
# Livnium Core

Livnium Core is a base-27 spatial grammar over a 3×3×3 lattice.

## Quick Start
```bash
dart pub add livnium_core
````

* Explore the **API**: [/api/index.html](/api/index.html)
* Concepts: spatial alphabet, rotations, energy model.

````

**Create:** `docs/concepts/energy.md`
```md
# Symbolic Energy (Primer)

- 8 corners (3 faces), 12 edges (2 faces), 6 face centers (1 face) → 54 faces.
- We normalize total energy to 10.125 for even per-face distribution (10.125 / 54 = 0.1875 per face).
- Corner = 3×, Edge = 2×, Face = 1× exposure. (Details: how energy aggregates per glyph/word.)
````

**Create:** `docs/api.md`

````md
# API Reference

The full, auto-generated Dart API lives at:

👉 **[/api/index.html](/api/index.html)**

> Regenerate with:
> ```bash
> npm run sync:api
> ```
````

---

## 4) Add DartPad component + example page

**Create:** `src/components/DartPad.tsx`

```tsx
import React from 'react';

export default function DartPad({ gistId, height = 520 }) {
  const src = `https://dartpad.dev/embed-flutter.html?id=${gistId}`;
  return (
    <iframe
      src={src}
      style={{ width: '100%', height, border: 0, overflow: 'hidden' }}
      loading="lazy"
      allow="clipboard-read; clipboard-write; geolocation"
      title="DartPad"
    />
  );
}
```

**Create:** `docs/examples/base27.mdx`

```mdx
import DartPad from '@site/src/components/DartPad';

# Base-27 Playground

Try a minimal encoder demo:

<DartPad gistId="PUT_YOUR_GIST_ID_HERE" height={560} />
```

---

## 5) Run locally

```bash
npm run sync:api
npm run start
```

---

## 6) GitHub Pages deployment (CI)

### 6.1 Prepare repo

* Ensure `livnium-docs` has remote on GitHub.
* In `docusaurus.config.js`, set `organizationName`, `projectName`, `url`, `baseUrl` correctly.
* Create a **fine-grained PAT** or use default `GITHUB_TOKEN` in Actions.

### 6.2 Workflow

**File:** `.github/workflows/docs.yml`

```yaml
name: Build & Deploy Docs

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]

jobs:
  docs:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      # Get livnium-core alongside livnium-docs
      - name: Checkout livnium-core
        uses: actions/checkout@v4
        with:
          repository: <YOUR_GH_USERNAME>/livnium-core
          path: ../livnium-core
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup Dart
        uses: dart-lang/setup-dart@v1
        with:
          sdk: 'stable'

      - name: Install deps
        run: npm ci

      - name: Build dartdoc and sync
        run: npm run sync:api

      - name: Build site
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
          force_orphan: true
```

> If deploying to `<user>.github.io` root, set `baseUrl: '/'` and publish to that repo. If deploying to a project page (recommended), keep `baseUrl: '/livnium-docs/'`.

---

## 7) One-shot setup script (optional)

**File:** `scripts/first_run.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

# From livnium/ root:
[ -d livnium-docs ] || npx create-docusaurus@latest livnium-docs classic --package-manager npm --skip-install

pushd livnium-docs >/dev/null
npm i
mkdir -p scripts docs/concepts src/components docs/examples .github/workflows

# Drop prepared files if they don't exist
[ -f scripts/sync_api.sh ] || cat > scripts/sync_api.sh <<'EOF'
# (paste content from step 2)
EOF
chmod +x scripts/sync_api.sh

# Create starter pages if missing
[ -f docs/intro.md ] || cat > docs/intro.md <<'EOF'
# (paste intro.md content)
EOF

[ -f docs/concepts/energy.md ] || cat > docs/concepts/energy.md <<'EOF'
# (paste energy.md content)
EOF

[ -f docs/api.md ] || cat > docs/api.md <<'EOF'
# (paste api.md content)
EOF

[ -f src/components/DartPad.tsx ] || cat > src/components/DartPad.tsx <<'EOF'
/* (paste DartPad.tsx content) */
EOF

[ -f docs/examples/base27.mdx ] || cat > docs/examples/base27.mdx <<'EOF'
/* (paste base27.mdx content) */
EOF

# Print next steps
echo "Run: npm run sync:api && npm run start"
popd >/dev/null
```

---

## 8) Content checklist (for you)

* **Docs outline:** Intro, Getting Started, Concepts (alphabet, rotations, energy, grid), Guides (encoding, rotations API, examples), FAQ, Changelog.
* **Examples:** Embed 2–3 DartPad demos (alphabet ↔ digits, rotate vec3, energy calc).
* **API hygiene:** Ensure `dartdoc` sees public comments (///), meaningful examples.

---

## 9) Run commands (happy path)

```bash
# from livnium-core/
cd ..
bash livnium-docs/scripts/first_run.sh

# local preview
cd livnium-docs
npm run sync:api
npm run start

# when ready
git add .
git commit -m "docs: scaffold docusaurus + dartdoc integration"
git push origin main
```
