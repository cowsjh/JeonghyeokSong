# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JavaScript portfolio website for Jeonghyeok Song, a 3D artist (Game Art / Film VFX). No build system or package manager — open `index.html` directly in a browser to develop.

**Repository:** https://github.com/cowsjh/JeonghyeokSong.github.io
**Deployed:** https://cowsjh.github.io/JeonghyeokSong.github.io (GitHub Pages, `main` branch)

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

1. Create `works/<slug>.md` with YAML frontmatter:
   ```yaml
   ---
   title: Project Title
   category: Game Art
   thumbnail: ../assets/images/filename.jpg
   date: 2024.06
   tools: Houdini 21.0, Unreal Engine 5.6
   link: https://www.artstation.com/...
   ---
   Body content in Markdown...
   ```
2. Add a post card in `index.html` (`.post-card`) inside `.posts-grid`, linking to `work.html?id=<slug>`.
3. Add the thumbnail to `assets/images/`.

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
