# JD Profit Calculator

A React and Vite dashboard for estimating food-business costs, profit, break-even sales, and profit targets.

## Run locally

```sh
npm ci
npm run dev
```

## Publish with GitHub Pages

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds the site and deploys the generated `dist` folder whenever changes are pushed to `main`.

1. Push the project to the `main` branch of your GitHub repository.
2. In the repository, open **Settings → Pages** and set the build and deployment source to **GitHub Actions**.
3. Open the **Actions** tab and wait for **Deploy to GitHub Pages** to finish. Your published URL will be shown in the deployment details.

The Vite build uses relative asset paths so it can load from a repository Pages URL as well as a custom domain.
