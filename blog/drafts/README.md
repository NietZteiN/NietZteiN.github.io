# Drafts

Private scratchpad. Every `.md` in this folder is gitignored — it never gets
committed, never reaches GitHub, and never appears on the site. Name files
whatever you like; no front matter or date prefix is needed while drafting.

To publish a draft, move it into `../posts/` with a dated filename:

```bash
mv blog/drafts/my-idea.md blog/posts/2026-08-01-my-idea.md
```

Use plain `mv`, not `git mv` — git refuses to move a file it isn't tracking.

Then make sure it has front matter (`title`, `date`, `summary`, `tags`), commit,
and push. The Action rebuilds `index.json` and the post goes live. See
[../README.md](../README.md) for the full publishing flow.

This README is the one tracked file here, so the folder survives a fresh clone.
Your drafts do not — they live only on this machine.
