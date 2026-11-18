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
| `/` | `src/apps/home/` |
| `/about-us` | `src/apps/about-us/` |
| `/careers` | `src/apps/careers/` |
| `/contact-us` | `src/apps/contact/` |
| `/pricing` | `src/apps/pricing/` |
| `/get-started` | `src/apps/complete saas/` |
| `/use-cases-success-stories` | `src/apps/use-cases/` |
| `/professional-services` | `src/apps/professional services/` |
| `/outsourcing` | `src/apps/outsourcing page/` |
| `/partners` | `src/apps/partner-page/` |
| `/partner-programme` | `src/apps/partner-builder/` |
| `/partner-commission` | `src/apps/partner-commission/` |
| `/partner-reseller-portal` | `src/apps/partner-reseller-portal/` |
| `/partner-registry` | `src/apps/global-partner-registry/` |
| `/faq` | `src/apps/ai-powwr/` |
| `/blog` | `src/apps/saas-blog/` |
| `/training` | `src/apps/training/` |
| `/privacy-policy` | `src/apps/privacy-policy/` |
| `/terms-and-conditions` | `src/apps/terms and condition/` |
| `/refund-policy` | `src/apps/refund policy/` |

## How it fits together

- `index.html`, `package.json`, `vite.config.ts` at the root build the whole site.
- `src/routes.ts` maps each URL to a page folder in `src/apps/` (add new pages here).
- `src/pages/*.tsx` wraps each folder's `App` with the providers from its old `main.tsx`.
- Each page's own `index.css` is only applied while that page is open, so pages keep their original look.
- A floating **Pages** button (bottom-left) lists every page; each page also keeps its own navbar.

## Deploying

`netlify.toml` is included (build `npm run build`, publish `dist`, SPA redirect).
Secrets go in a local `.env` (git-ignored) - see `.env.example`.
