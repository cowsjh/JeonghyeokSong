# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JavaScript portfolio website for Jeonghyeok Song, a 3D artist (Game Art / Film VFX). No build system or package manager — open `index.html` directly in a browser to develop.

**Repository:** https://github.com/cowsjh/JeonghyeokSong
**Deployed:** https://cowsjh.github.io/JeonghyeokSong (GitHub Pages, `main` branch)

## CRITICAL RULES

**NEVER run `git push` without explicit confirmation from the user first.**
Always commit locally, show the result, then ask "푸시할까요?" before pushing.

## Development

No build step. To preview locally, open `index.html` in a browser or serve with any static file server:

```bash
# Python
python -m http.server 8080

# Node (if available)
npx serve .
```

No linting, testing, or compilation configured.

## Architecture

### Page Flow

- **`index.html`** — Blog-style landing page with compact intro, 2-column post card grid, and contact links.
- **`work.html`** — Single work detail template. Reads `?id=<slug>` from the URL, fetches `works/<slug>.md`, parses frontmatter, and renders the page dynamically using `marked.js` (loaded from CDN).

### Adding a New Work

The user writes the `.md` file and asks Claude to sync. Claude handles the rest.

**User workflow:**
1. Create `works/<slug>.md` with YAML frontmatter:
   ```yaml
   ---
   title: Project Title
   category: Game Art
   thumbnail: assets/images/filename.jpg
   date: 2024.06
   tools: Houdini 21.0, Unreal Engine 5.6
   link: https://www.artstation.com/...
   ---
   Body content in Markdown...
   ```
2. Add the thumbnail to `assets/images/`.
3. Tell Claude to sync — Claude will handle steps below.

**Claude sync tasks (on request):**
1. Add the new work entry to `works/data.js` (`window.WORKS` object).
2. Add a `.post-card` in `index.html` inside `.posts-grid`, linking to `work.html?id=<slug>`.
3. Commit and push to GitHub.

> `works/data.js` is the runtime data source loaded via `<script>` tag. It must stay in sync with the `.md` files. The `.md` files are the human-readable source of truth; `data.js` is derived from them.

### Key Design Tokens (CSS variables in `style.css`)

- `--bg`: `#ffffff` (white)
- `--surface`: `#f7f7f7`, `--surface2`: `#eeeeee` (light greys)
- `--accent`: `#1a1a1a` (near-black)
- `--text`: `#1a1a1a`, `--text-muted`: `#888888`
- `--border`: `#e4e4e4`
- Fonts: Playfair Display (headings), Inter (body) via Google Fonts

### Responsive Breakpoints

- `≤ 960px`: 2-column post grid
- `≤ 640px`: 1-column post grid

### External Dependencies

- `marked.js` — loaded from jsDelivr CDN in `work.html` for markdown parsing
- Google Fonts — Playfair Display, Inter

## Assets

Images live in `assets/images/`. The repo uses Git LFS — large image files are tracked via LFS, not stored directly in Git.
