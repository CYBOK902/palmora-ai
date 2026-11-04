# Palmora AI

Palmora AI is a React/Vite website served by an Express/Node.js application. The server calls Google Gemini for palm and compatibility readings and uses PostgreSQL to keep explicitly created share links available across restarts.

## Requirements

- Node.js 22.12 or newer
- npm
- A Google Gemini API key for AI readings
- PostgreSQL for persistent share links
- Docker for the container deployment path

## Run locally

1. Install dependencies:

   ```sh
   npm ci
   ```

2. Copy `.env.example` to `.env` and set `GEMINI_API_KEY`. Choose a Gemini model available to your API account using `GEMINI_MODEL` and, optionally, `GEMINI_FALLBACK_MODEL`.

3. Start the development server:

   ```sh
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

The site and AI-reading endpoints work locally without PostgreSQL, but share links return an explicit unavailable response until `DATABASE_URL` is configured. To test sharing, point `DATABASE_URL` at a PostgreSQL database; the app creates its share table on startup. Never reuse development database credentials in production.

Run the TypeScript check and production build with:

```sh
npm run check
```

## Production environment

Set these in your hosting provider's secret/environment settings:

| Variable | Required | Purpose |
|---|---:|---|
| `GEMINI_API_KEY` | Yes | Private server-side Google Gemini API key. Never expose it as a `VITE_*` variable. |
| `DATABASE_URL` | Yes | Managed PostgreSQL connection URL for expiring share links. |
| `GEMINI_MODEL` | No | Gemini model ID; defaults to `gemini-3.8-flash`. |
| `GEMINI_FALLBACK_MODEL` | No | Capacity fallback model; defaults to `gemini-3.1-flash-lite`. |
| `PORT` | No | HTTP port supplied by the host; defaults to `3000`. |
| `TRUST_PROXY_HOPS` | Host-specific | Number of trusted reverse proxies in front of the app. Defaults to `0`; configure from your host's documentation, not by guesswork. |

Production startup intentionally fails if the Gemini key or PostgreSQL URL is missing. The application creates the `shared_readings` table automatically. Shared readings and their palm images expire after 30 days and can be revoked early. Database backups may retain copies according to the provider's backup policy.

Use the provider's supported PostgreSQL TLS settings for `DATABASE_URL`. Keep credentials in the host's secret manager, enable database backups, and restrict database access to the application where possible.

## Deploy on Render

1. Push this project to the GitHub repository connected to your Render account.
2. In Render, create a **Web Service**, select the repository, and choose the **Docker** runtime. Use the repository's `Dockerfile` and select a paid instance plan suitable for a continuously available app.
3. Create a managed PostgreSQL database in the same region as the web service. Use its **internal** connection URL for `DATABASE_URL`.
4. Add `GEMINI_API_KEY` as a secret in Render, and set `DATABASE_URL`, `GEMINI_MODEL`, and `GEMINI_FALLBACK_MODEL` as needed. Set `TRUST_PROXY_HOPS=1` for Render's reverse proxy, then verify the reported client IP/rate limiting after deployment. Render supplies `PORT`.
5. Set the health check path to `/healthz`; use `/readyz` for readiness if available. Deploy and wait for the service to report healthy.
6. Test the generated `onrender.com` HTTPS URL. HTTPS is required for browser camera access. Add a custom domain later if desired.

Do not use an ephemeral/free database for share links; select a plan with the required persistence and backup behavior. Review current Render plan limits and pricing before creating paid resources.

## Deploy on Vercel

The repository includes Vercel configuration for the Vite frontend and an Express serverless function for the API.

1. Import this GitHub repository into Vercel, or run `vercel` from the repository root.
2. Set `GEMINI_API_KEY` and `DATABASE_URL` in the Vercel project's environment variables. Use a managed PostgreSQL provider such as Neon and its pooled connection URL.
3. Optionally set `GEMINI_MODEL` and `GEMINI_FALLBACK_MODEL`. Vercel provides `PORT` as needed; `TRUST_PROXY_HOPS` is not required for this deployment.
4. Deploy and verify `/`, `/api/healthz`, `/api/readyz`, AI readings, and share-link creation. The first request to `/api/readyz` also verifies the database connection.

The API function is configured for a 60-second maximum duration. Vercel Functions have request-size, execution-time, and usage limits that vary by plan; check the current Vercel limits against image-based requests before launch. A Vercel deployment does not make Gemini API usage or a separately hosted database free.

## Deploy with Docker

Build and test the production image:

```sh
docker build -t palmora-ai .
```

Run it locally after preparing `.env` with a valid Gemini key and PostgreSQL URL:

```sh
docker run --rm --env-file .env -e PORT=8080 -p 8080:8080 palmora-ai
```

Deploy the image to a container host that supports long-running Node.js services, environment secrets, HTTPS, and PostgreSQL connectivity. Configure the health check as `/healthz`; use `/readyz` as the readiness check when the host supports it. Set the required production variables and a trusted proxy hop count appropriate to the provider.

For the first public deployment, keep the service to one instance or add a shared rate-limit store/edge protection before scaling horizontally. The current rate-limit counters are process-local and reset when an instance restarts. Apply provider-level spending quotas and alerts to the Gemini API key as well.

## Before making the site public

- Replace the operator/contact and jurisdiction placeholders in [`public/privacy.html`](./public/privacy.html) and [`public/terms.html`](./public/terms.html), and obtain appropriate legal review for the markets where the service will operate.
- Review Google's current Gemini API terms, data handling, and retention settings for the account and model you will use.
- Configure and verify the host, custom domain, HTTPS certificate, health checks, database backups, secret rotation, spending alerts, and an incident/rollback procedure.
- Test real image analysis and compatibility requests with the production Gemini account; check quotas, billing, and both configured model IDs.
- Test camera access on an HTTPS mobile device, image uploads near the size limit, expired/revoked share links, browser history clearing, and service restart behavior.
- Confirm your host's reverse-proxy topology before setting `TRUST_PROXY_HOPS`. Add a distributed rate-limit store or edge/API gateway before running multiple app instances.

The privacy and terms pages describe the app's current technical behavior, but are launch drafts rather than jurisdiction-specific legal advice. The site owner must complete their operator information and review the final text before launch.
