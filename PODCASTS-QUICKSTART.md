# Podcasts — Quick Start Checklist

A public "Podcasts" page has been added at `/podcasts`, listed in the nav
next to "Lectures". It works the same way the Lecture Library does — it
fetches a `manifest.json` from a separate public GitHub repo at page-load
time — but with no password gate, since these are meant to be public and
downloadable.

Two things are already done for you in this repo:

- `src/pages/podcasts.astro` — the page itself
- `src/layouts/BaseLayout.astro` — updated nav with a "Podcasts" link
- `podcast-repo-template/` — a ready-to-push starting point for the
  distribution repo, already containing your first episode
  ("Earth's Gravity Pulls Your Lungs Open", re-encoded from 40MB down to
  ~15MB at 96kbps AAC so it stays well under GitHub's file-size limits)

One thing you need to do once, outside this session:

## Step 1 — Create the public distribution repo

Go to https://github.com/new and create:

```
Repo name:  platypusandfox-podcasts-public
Visibility: Public
Initialize: with README   (you'll overwrite it)
```

This matches the name already wired into `src/pages/podcasts.astro`
(`GITHUB_USERNAME = 'kbenfield-716ths'`, `PUBLIC_REPO =
'platypusandfox-podcasts-public'`). If you'd rather use a different repo
name, just edit those two constants at the top of `podcasts.astro`.

## Step 2 — Push the template contents

From this repo:

```bash
cd podcast-repo-template
git init
git add -A
git commit -m "First episode: Earth's Gravity Pulls Your Lungs Open"
git branch -M main
git remote add origin https://github.com/kbenfield-716ths/platypusandfox-podcasts-public.git
git push -u origin main
```

## Step 3 — Deploy this site

```bash
git add src/pages/podcasts.astro src/layouts/BaseLayout.astro podcast-repo-template PODCASTS-QUICKSTART.md
git commit -m "Add public Podcasts page"
git push
```

Your site rebuilds automatically. Visit `platypusandfox.com/podcasts` —
give the distribution repo's raw content a minute or two to become
available after step 2 if the page shows the error state right away.

## Ongoing: adding a new episode

1. (Optional but recommended) shrink the file first — spoken-word audio
   compresses hard with no audible quality loss:
   ```bash
   ffmpeg -i original.m4a -c:a aac -b:a 96k -ac 2 -movflags +faststart episode.m4a
   ```
2. Drop the file into `episodes/` in the `platypusandfox-podcasts-public`
   repo (clone it locally, or add the file via the GitHub web UI)
3. Add an entry to that repo's `manifest.json` (id, title, description,
   date, duration, filename)
4. `git push` — the site picks it up on next page load, no rebuild needed
   on this side

See `podcast-repo-template/README.md` for the full manifest format.
