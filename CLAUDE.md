# CLAUDE.md

Static HTML/CSS/JS portfolio. No build system — open `index.html` in browser.

**Repo:** https://github.com/cowsjh/JeonghyeokSong  
**Live:** https://cowsjh.github.io/JeonghyeokSong (GitHub Pages, `main`)

## Rules

- **Never `git push` without confirmation.** Commit locally → ask "푸시할까요?"

## Files

| File | Role |
|---|---|
| `index.html` | Landing page, post card grid |
| `work.html` | Work detail page (`?id=<slug>`) |
| `works/<slug>.md` | Source of truth for each work |
| `works/data.js` | Runtime data (`window.WORKS`) — derived from `.md` files |
| `assets/images/` | Images (Git LFS) |

## Adding a New Work

User creates `works/<slug>.md` + adds thumbnail, then asks Claude to sync.

**Frontmatter:**
```yaml
title:     Project Title
category:  Game Art
thumbnail: assets/images/filename.jpg
date:      2024.06
tools:     Houdini 21.0, Unreal Engine 5.6
link:      https://www.artstation.com/...
```

**Claude sync tasks:**
1. Add entry to `works/data.js`
2. Add `.post-card` to `index.html` `.posts-grid`
3. Commit → confirm → push
