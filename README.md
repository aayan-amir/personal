# Interactive Portfolio

A Vite, React, and Three.js starter portfolio built for GitHub Pages.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy On GitHub Pages

1. Push this repository to GitHub.
2. Open the repository settings.
3. Go to Pages.
4. Set Source to GitHub Actions.
5. Push to `main`; the workflow in `.github/workflows/deploy.yml` will publish the site.

## Custom Domain

In GitHub Pages settings, add your domain under Custom domain. After GitHub verifies it, add the DNS records your domain registrar shows you.

If you want the domain stored in the repo too, create `public/CNAME` and put only your domain in it, for example:

```text
example.com
```
