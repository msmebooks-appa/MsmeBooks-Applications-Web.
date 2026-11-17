# MsmeBooks Website

All MsmeBooks pages merged into **one** React + Vite single-page app.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

## Pages

| URL | Folder |
| --- | --- |
| `/` | `home/` |
| `/about-us` | `about-us/` |
| `/careers` | `careers/` |
| `/contact-us` | `contact/` |
| `/pricing` | `pricing/` |
| `/get-started` | `complete saas/` |
| `/use-cases-success-stories` | `use-cases/` |
| `/professional-services` | `professional services/` |
| `/outsourcing` | `outsourcing page/` |
| `/partners` | `partner-page/` |
| `/partner-programme` | `partner-builder/` |
| `/partner-commission` | `partner-commission/` |
| `/partner-reseller-portal` | `partner-reseller-portal/` |
| `/partner-registry` | `global-partner-registry/` |
| `/faq` | `ai-powwr/` |
| `/blog` | `saas-blog/` |
| `/training` | `training/` |
| `/privacy-policy` | `privacy-policy/` |
| `/terms-and-conditions` | `terms and condition/` |
| `/refund-policy` | `refund policy/` |

## How it fits together

- `index.html`, `package.json`, `vite.config.ts` at the root build the whole site.
- `src/routes.ts` maps each URL to a page folder (add new pages here).
- `src/pages/*.tsx` wraps each folder's `App` with the providers from its old `main.tsx`.
- Each page's own `index.css` is only applied while that page is open, so pages keep their original look.
- A floating **Pages** button (bottom-left) lists every page; each page also keeps its own navbar.

## Deploying

`netlify.toml` is included (build `npm run build`, publish `dist`, SPA redirect).
Secrets go in a local `.env` (git-ignored) - see `.env.example`.
