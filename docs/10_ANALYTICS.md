# Analytics

PishTalk uses [Umami](https://umami.is), self-hosted, served at
`https://pishtalk.ir/analytics`. It's cookieless and doesn't need a consent
banner, and since it's self-hosted, traffic data never leaves the VPS.

Two things are tracked:

- **Pageviews**, automatically, for every route (including client-side
  navigations via `router.push`).
- **Registration funnel events**, fired manually from
  `features/registration/components/RegistrationForm.tsx` via
  `lib/analytics.ts`:
  - `registration_started` — fired once, the first time a visitor edits any
    field. Lets you tell "viewed the form" apart from "started filling it
    in".
  - `registration_submitted` — fired on every submit attempt.
  - `registration_failed` — fired when the server rejects the submission,
    with a `reason` property set to a stable code (`RATE_LIMITED`,
    `CAPACITY_FULL`, `DUPLICATE_PHONE`, etc. — see `CreateRegistrationErrorCode`
    in `features/registration/actions/createRegistration.ts`).
  - There's no explicit "success" event — the redirect to `/register-success`
    is itself a pageview, so a separate event would just double-count it.
    Successful registrations = pageviews on `/register-success`.

## Why a custom-built image

Umami's `BASE_PATH` (needed to serve it under `/analytics` instead of its
own subdomain) is a Next.js **build-time** value. The official prebuilt
`ghcr.io/umami-software/umami` image doesn't have it baked in, so
`docker-compose.yml` builds Umami from source instead, pinned to a tag:

```yaml
build:
  context: https://github.com/umami-software/umami.git#v3.2.0
  args:
    BASE_PATH: /analytics
```

The tradeoff: upgrading Umami means bumping that tag and rebuilding, not
just pulling a new image. Bump deliberately, check the release notes at
https://github.com/umami-software/umami/releases first.

## One-time server setup

1. **Set env vars** in `.env` on the VPS:
   ```
   UMAMI_DB_PASSWORD=<random>
   UMAMI_APP_SECRET=<openssl rand -base64 32>
   ```
   Leave `NEXT_PUBLIC_UMAMI_WEBSITE_ID` and `NEXT_PUBLIC_UMAMI_SCRIPT_URL`
   unset for now — you don't have a website ID until step 3.

2. **Add the Nginx location block** to the existing `pishtalk.ir` server
   block (this lives on the VPS, not in this repo):
   ```nginx
   location /analytics/ {
       proxy_pass http://127.0.0.1:3001/analytics/;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```
   Then `sudo nginx -t && sudo systemctl reload nginx`.

3. **Build and start Umami**, log in, register the site:
   ```
   docker compose build umami
   docker compose up -d umami-db umami
   ```
   Visit `https://pishtalk.ir/analytics`, log in with the default
   `admin` / `umami` (Umami forces a password change on first login),
   then **Settings → Websites → Add website** with domain `pishtalk.ir`.
   Copy the generated **Website ID**.

4. **Finish the env vars** in `.env`:
   ```
   NEXT_PUBLIC_UMAMI_WEBSITE_ID=<the website id from step 3>
   NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://pishtalk.ir/analytics/script.js
   ```

5. **Rebuild and restart the app** so it picks up the new env vars:
   ```
   docker compose up -d --build app
   ```

6. Load the site, click around, submit a test registration, and confirm
   events show up under the site's **Events** tab in Umami within a minute
   or two.
