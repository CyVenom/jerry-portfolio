# Portfolio

Personal portfolio site: cybersecurity projects, experience and resume.

**Live site:** https://jerry-0xcybervenom.vercel.app

## Stack

- React 19 + Vite
- Plain CSS (light and dark themes, follows the system preference)
- Fonts: Fraunces, Schibsted Grotesk, JetBrains Mono
- Hosted on Vercel

## Edit the content

All content lives in `src/data/`:

| File | What it holds |
|---|---|
| `profile.js` | Name, links, experience, education, skills, certifications, community |
| `projects.js` | Every project. Set `status: 'public'` with a `repo` link, or `status: 'private'` with a short `glimpse` |

Private projects are shown as a summary only, with no link. Projects with a live site can add `live` and `shot` (a screenshot in `public/shots/`) to get a preview image.

## Run locally

```
npm install
npm run dev
```

Build for production:

```
npm run build
npm run preview
```
