# Agoura High Charger Post

The website for the Agoura High Charger Post, moved from WordPress (DreamHost) to GitHub Pages.

- **Editors:** publish articles at `/admin/`. See **[EDITOR-GUIDE.md](EDITOR-GUIDE.md)**.
- **How it works:** articles are files in this repository. Saving in the editor commits the file to GitHub, and a GitHub Action rebuilds the site with [Eleventy](https://www.11ty.dev/) and publishes it to GitHub Pages in about a minute.

The site looks and works like the WordPress version: same theme, same URLs for every article, section, tag, writer and monthly archive, plus the homepage ticker, banner, sidebar, and search.

## What's where

| Path | What it is |
| --- | --- |
| `src/articles/` | One file per article: settings at the top (headline, date, writer, sections, tags, photo), article HTML below. |
| `src/writers/` | One file per writer profile. The file name is their author-page URL (`/author/<name>/`). |
| `src/_data/homepage.json` | The two stories beside the homepage banner. |
| `src/admin/` | The article editor ([Sveltia CMS](https://sveltiacms.app/)) and its settings, `config.yml`. |
| `src/images/uploads/` | Photos uploaded through the editor. |
| `src/wp-content/`, `src/wp-includes/` | The original WordPress theme files and photo uploads, kept at their old URLs. |
| `src/_includes/` | Page templates built from the WordPress theme's HTML. |
| `src/pages/` | Leftover WordPress pages (Blog, Games, Gallery, Resources, Team), copied as they were. |
| `eleventy.config.js` | Build settings: article lists, archive pages, thumbnails, pagination. |
| `.github/workflows/deploy.yml` | Builds and publishes the site on every change to `main`. |

## Going live (one time)

The site lives in the repository **[agourahighchargerpost/agourahighchargerpost.github.io](https://github.com/agourahighchargerpost/agourahighchargerpost.github.io)**, owned by the newspaper's own GitHub account (`agourahighchargerpost`), so it doesn't belong to one student and can be handed down each year. Because the repository is named `<account>.github.io`, GitHub serves it at the top of **https://agourahighchargerpost.github.io/**, which is handy for testing before the real domain is switched over.

Already done: the code is pushed, and **Settings → Pages → Source** is set to **GitHub Actions**. To finish:

1. **Test** everything at https://agourahighchargerpost.github.io/, including publishing a test article at `/admin/`.
2. **Custom domain:** **Settings → Pages → Custom domain**: `www.agourahighchargerpost.com`. With GitHub Actions publishing, this setting is what counts (the `CNAME` file is just a reminder). From then on the github.io address redirects to the real domain.
3. **DNS** (in DreamHost's DNS panel). Replace the two `A` records that point to DreamHost (`69.163.140.209`) with:
   - `www`: `CNAME` to `agourahighchargerpost.github.io`
   - `agourahighchargerpost.com` (no `www`): `A` records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`

   To switch back, restore the two `A` records to `69.163.140.209`. The records refresh every 60 seconds, so either change shows up within minutes.
4. When GitHub shows the domain as verified, tick **Enforce HTTPS**.
5. Add editors as described at the end of [EDITOR-GUIDE.md](EDITOR-GUIDE.md).

Before cancelling DreamHost, publish any articles still on WordPress here first. Also download a backup of the WordPress site from DreamHost.

> **Optional: move to a GitHub organization.** Because the repository is owned by a personal account, editors sign in with a *classic* access token (GitHub's newer fine-grained tokens can't reach another person's repository). If you later want per-editor permissions or fine-grained tokens, create a free organization and use **Settings → Transfer** on the repository; then update `repo:` in `src/admin/config.yml` and the DNS `CNAME` target.

## Working on the site locally

Needs Node.js 20 or newer.

```bash
npm install
```

```bash
npm start
```

This serves the site at http://localhost:8080 and rebuilds as you edit. `npm run build` writes the finished site to `_site/`.

## Optional upgrades

- **One-click "Sign In with GitHub"** instead of access tokens: deploy [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) (free on Cloudflare Workers), then add its URL as `base_url` and `oauth` to `auth_methods` in `src/admin/config.yml`.
- **Editors without GitHub accounts** (username and password, plus roles like editor or viewer): [Sveltia CMS Additions](https://sveltiacms.app/docs/additions), also free on Cloudflare Workers.

## What changed from WordPress

- Comments are gone (there were none).
- The header search no longer suggests articles as you type. Pressing Enter shows full results from an in-browser search.
- RSS feeds and the WordPress API no longer exist.
- Writer pages now list every article by that writer.
