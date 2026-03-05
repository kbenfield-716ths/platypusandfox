# Lecture System — Quick Start Checklist

Complete these steps once to get the system running. Takes about 30 minutes.

---

## Step 1 — Create Two New GitHub Repos

Go to https://github.com/new and create:

- [ ] **`platypusandfox-lectures`** — Private ✅, initialize with README
- [ ] **`platypusandfox-lectures-public`** — Public ✅, initialize with README

---

## Step 2 — Set Up the Private Repo

In `platypusandfox-lectures`, create this folder structure:

```
platypusandfox-lectures/
├── .github/
│   └── workflows/
│       └── publish.yml    ← copy from lecture-repo-template/ in this repo
├── lectures/
│   └── (your .pptx files go here, organized in subfolders)
└── manifest.json          ← copy from lecture-repo-template/ in this repo
```

Edit `publish.yml` line 18: replace `YOUR_GITHUB_USERNAME` with your GitHub username.

---

## Step 3 — Create a GitHub Personal Access Token

1. Go to https://github.com/settings/tokens → "Generate new token (classic)"
2. Name it: `lectures-publish`
3. Expiration: 1 year (or "No expiration")
4. Scopes: check **`repo`** (full control of private repositories)
5. Click "Generate token" — **copy it now, it won't show again**

---

## Step 4 — Add the Token as a Secret

In `platypusandfox-lectures` (private repo):
1. Settings → Secrets and variables → Actions → "New repository secret"
2. Name: `PUBLISH_TOKEN`
3. Value: (paste the token from Step 3)

---

## Step 5 — Set Your Password

Generate your password hash. Open your browser console (F12) and paste:

```javascript
const e = new TextEncoder();
const d = e.encode('type-your-password-here');
const h = await crypto.subtle.digest('SHA-256', d);
console.log(Array.from(new Uint8Array(h)).map(b=>b.toString(16).padStart(2,'0')).join(''));
```

Replace `'type-your-password-here'` with your actual password before running.
Copy the long hex string it outputs.

Open `src/pages/lectures.astro` in this repo and replace:
```javascript
const PASSWORD_HASH = 'YOUR_HASH_HERE';
const GITHUB_USERNAME = 'YOUR_GITHUB_USERNAME';
```

With:
```javascript
const PASSWORD_HASH = 'paste-your-hash-here';
const GITHUB_USERNAME = 'your-actual-github-username';
```

---

## Step 6 — Add Your First Lecture

1. Upload a `.pptx` file to `platypusandfox-lectures/lectures/series-name/`
2. Edit `manifest.json` to add an entry for it (see LECTURES-SYSTEM.md for format)
3. Push to main — GitHub Actions will publish it automatically (~60 seconds)

---

## Step 7 — Deploy

Push your changes to `platypusandfox`:
```bash
git add src/pages/lectures.astro src/layouts/BaseLayout.astro
git commit -m "Add password-protected lecture library"
git push
```

Your site rebuilds automatically. Visit `platypusandfox.com/lectures` to test.

---

## Ongoing: Adding New Lectures

1. Drop the `.pptx` into the right subfolder in the private repo
2. Add an entry to `manifest.json`
3. `git push` → done in 60 seconds

## Ongoing: Changing the Password

1. Generate a new hash (Step 5)
2. Edit `lectures.astro`, replace the hash
3. `git push` to `platypusandfox` → deployed automatically
4. Tell your audience the new password

---

## Files Created by This Setup

| File | Repo | Purpose |
|------|------|---------|
| `src/pages/lectures.astro` | platypusandfox | The password-gated lecture page |
| `src/layouts/BaseLayout.astro` | platypusandfox | Updated nav (Lectures link added) |
| `lecture-repo-template/manifest.json` | platypusandfox | Template — copy to private repo |
| `lecture-repo-template/.github/workflows/publish.yml` | platypusandfox | Template — copy to private repo |
| `LECTURES-SYSTEM.md` | platypusandfox | Full architecture reference |
| `LECTURES-QUICKSTART.md` | platypusandfox | This file |
