# Njirlah AI - Cloudflare Deployment Guide

This project is configured for deployment on **Cloudflare Pages** using the `@cloudflare/next-on-pages` adapter.

## Prerequisites

1.  **Cloudflare Account**: Create one at [dash.cloudflare.com](https://dash.cloudflare.com).
2.  **Workers AI**: Ensure Workers AI is enabled in your account.
3.  **Cloudflare CLI (Wrangler)**: Installed via `npm install -g wrangler`.

## Local Build & Preview

To build the project for Cloudflare locally (requires a Linux/WSL environment for full reliability):

```bash
npm run pages:build
```

To preview the build:

```bash
npm run pages:preview
```

## Deployment

### Option 1: Automatic Deployment (Recommended)

1.  Push your code to **GitHub** or **GitLab**.
2.  Go to the Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3.  Select your repository.
4.  Set **Build command**: `npm run pages:build`
5.  Set **Build output directory**: `.vercel/output/static`
6.  Add **Environment Variables** in the Pages settings:
    - `NODE_VERSION`: `18` or higher
7.  Go to **Settings** → **Functions** → **Compatibility flags** and add `nodejs_compat` to both Production and Preview.
8.  Go to **Settings** → **Functions** → **Workers AI** and bind the `AI` binding.

### Option 2: CLI Deployment

```bash
# Login to Cloudflare
npx wrangler login

# Build and Deploy
npm run pages:deploy
```

## Integrated AI Features

This project includes a built-in integration with **Cloudflare Workers AI**.
- **API Route**: `/api/cloudflare/chat`
- **Models**: Available under the "Cloudflare Workers AI" provider in the model list.
- **Benefits**: Low latency, running on the global edge, and cost-effective.

## Note for Windows Users

The `@cloudflare/next-on-pages` build tool requires `bash` and may not work natively on Windows CMD/PowerShell. It is recommended to use **WSL (Windows Subsystem for Linux)** or deploy via **GitHub integration**.
