# Platypus & Fox — Lecture Distribution System

## Overview

This document describes the three-repo architecture for distributing password-protected
educational materials from platypusandfox.com.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     3-REPO SYSTEM                           │
│                                                             │
│  1. platypusandfox (PUBLIC)                                 │
│     └── Your Astro website                                  │
│         └── src/pages/lectures.astro  ← password gate      │
│                                                             │
│  2. platypusandfox-lectures (PRIVATE)  ← master files      │
│     ├── lectures/                                           │
│     │   ├── series-name/                                    │
│     │   │   ├── lecture-01.pptx                             │
│     │   │   └── lecture-02.pptx                             │
│     ├── manifest.json  ← what gets published                │
│     └── .github/workflows/publish.yml  ← auto-sync         │
│                                                             │
│  3. platypusandfox-lectures-public (PUBLIC)  ← distribution │
│     ├── lectures/  ← auto-pushed from private repo         │
│     └── manifest.json  ← fetched by Astro page             │
│                                                             │
│         PRIVATE REPO ──(GitHub Actions)──▶ PUBLIC REPO     │
│                                                    │        │
│         platypusandfox.com/lectures ──(fetch)──────┘        │
└─────────────────────────────────────────────────────────────┘
```

---

## How It Works

### Storing Files (Private Repo)
- All `.pptx` files live in `platypusandfox-lectures` (private)
- Full git version history: every revision is tracked
- Organized by series/topic in subfolders
- You update `manifest.json` to control what's published

### Publishing Files (Automation)
- When you push to `main` in the private repo, GitHub Actions runs
- It copies files listed in `manifest.json` to the public distribution repo
- Only files explicitly listed in the manifest get published — nothing accidental

### Accessing Files (Lectures Page)
- `platypusandfox.com/lectures` shows a password gate
- Correct password → page fetches `manifest.json` from the public repo
- Lecture cards appear with title, description, date, and download button
- Password auth persists for the browser session (no re-entry on refresh)

---

## Setup Steps

### Step 1: Create the Two New Repos on GitHub

**Private repo** (your master files):
```
Repo name:  platypusandfox-lectures
Visibility: Private
Initialize: with README
```

**Public repo** (distribution):
```
Repo name:  platypusandfox-lectures-public
Visibility: Public
Initialize: with README
```

### Step 2: Set Up the Private Repo Structure

```
platypusandfox-lectures/
├── .github/
│   └── workflows/
│       └── publish.yml         ← auto-sync workflow (see below)
├── lectures/
│   ├── intro-series/
│   │   └── lecture-01-intro.pptx
│   └── advanced-series/
│       └── lecture-01-advanced.pptx
├── manifest.json               ← controls what's published
└── README.md
```

### Step 3: Add a GitHub Actions Secret

In the **private repo** → Settings → Secrets and variables → Actions:

- Name: `PUBLISH_TOKEN`
- Value: A GitHub Personal Access Token with `repo` scope

This lets the private repo push to the public repo.

Generate a token at: https://github.com/settings/tokens
Scopes needed: `repo` (full control)

### Step 4: Add the Lectures Page to Your Astro Site

The file `src/pages/lectures.astro` has already been created in your
`platypusandfox` repo. It includes:

- Password gate UI
- Session-based auth persistence
- Dynamic lecture card rendering
- Download link reveal after auth

### Step 5: Set Your Password

In `src/pages/lectures.astro`, find this line:

```javascript
const PASSWORD_HASH = 'YOUR_HASH_HERE';
```

Generate your hash by running this in your browser console or Node.js:

```javascript
// Browser console method:
const encoder = new TextEncoder();
const data = encoder.encode('your-chosen-password');
const hashBuffer = await crypto.subtle.digest('SHA-256', data);
const hashArray = Array.from(new Uint8Array(hashBuffer));
const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
console.log(hashHex);
```

Replace `'YOUR_HASH_HERE'` with the output.

---

## manifest.json Format

```json
{
  "updated": "2026-03-05",
  "series": [
    {
      "id": "intro-series",
      "title": "Introduction to Quality Improvement",
      "description": "Foundational concepts for understanding QI methodology.",
      "lectures": [
        {
          "id": "intro-01",
          "title": "What is Quality Improvement?",
          "description": "Overview of QI principles and frameworks.",
          "date": "2026-01-15",
          "filename": "lectures/intro-series/lecture-01-what-is-qi.pptx",
          "version": "1.0"
        },
        {
          "id": "intro-02",
          "title": "PDSA Cycles in Practice",
          "description": "Applying Plan-Do-Study-Act to real improvement work.",
          "date": "2026-02-01",
          "filename": "lectures/intro-series/lecture-02-pdsa.pptx",
          "version": "2.1"
        }
      ]
    }
  ]
}
```

### To Rotate / Add / Remove Lectures

- **Add a lecture**: Add a `.pptx` to the private repo and add an entry to `manifest.json`
- **Remove from distribution**: Delete the entry from `manifest.json` (file stays in git history)
- **Update a file**: Replace the `.pptx`, bump the `version` field in the manifest
- **Push to publish**: `git push` — GitHub Actions handles the rest in ~60 seconds

---

## GitHub Actions Workflow (publish.yml)

Place this in the **private repo** at `.github/workflows/publish.yml`:

```yaml
name: Publish Lectures

on:
  push:
    branches: [main]
  workflow_dispatch:  # allows manual trigger from GitHub UI

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout private repo
        uses: actions/checkout@v4
        with:
          path: private

      - name: Checkout public repo
        uses: actions/checkout@v4
        with:
          repository: YOUR_GITHUB_USERNAME/platypusandfox-lectures-public
          token: ${{ secrets.PUBLISH_TOKEN }}
          path: public

      - name: Sync published files
        run: |
          # Read manifest and copy listed files
          cd private
          python3 << 'EOF'
          import json, shutil, os

          with open('manifest.json') as f:
              manifest = json.load(f)

          # Collect all filenames in manifest
          files_to_publish = []
          for series in manifest.get('series', []):
              for lecture in series.get('lectures', []):
                  files_to_publish.append(lecture['filename'])

          # Copy files to public repo
          for filepath in files_to_publish:
              src = filepath
              dst = f'../public/{filepath}'
              os.makedirs(os.path.dirname(dst), exist_ok=True)
              if os.path.exists(src):
                  shutil.copy2(src, dst)
                  print(f'Published: {filepath}')
              else:
                  print(f'WARNING: File not found: {filepath}')

          # Copy manifest
          shutil.copy2('manifest.json', '../public/manifest.json')
          print('Published: manifest.json')
          EOF

      - name: Commit and push to public repo
        run: |
          cd public
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add -A
          git diff --staged --quiet || git commit -m "Publish lectures $(date +'%Y-%m-%d %H:%M')"
          git push
```

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username.

---

## Password Change Process

1. Generate a new hash (see Step 5 above)
2. Edit `src/pages/lectures.astro` in the `platypusandfox` repo
3. Replace the hash value
4. Push — GitHub Actions deploys the change automatically

---

## Security Notes

- **What this protects against**: Casual browsers, search engine indexing, accidental sharing
- **What it does NOT protect against**: Determined users who inspect the page source
- **Appropriate for**: Educational lecture distribution to students/attendees
- **Not appropriate for**: Commercially sensitive or legally protected content

The password hash in the page source is a SHA-256 hash — it cannot be reversed
to reveal the plaintext password, but a motivated person could test passwords
against the hash. For educational materials, this level of protection is standard
and appropriate.

---

## Quick Reference

| Action | Where | Command |
|--------|-------|---------|
| Add a new lecture | Private repo | Add .pptx + update manifest.json, then push |
| Remove from distribution | Private repo | Remove entry from manifest.json, then push |
| Change password | platypusandfox repo | Update hash in lectures.astro, push |
| Manual publish trigger | Private repo → Actions tab | Run "Publish Lectures" workflow |
| Check publish status | Private repo → Actions tab | View workflow run logs |
