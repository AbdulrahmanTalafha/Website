# WeRise website — Docker

Next.js frontend only. Run from this folder (`werise-new`).

**Start the CMS first** (`WeRise-CMS-new` on port 8000) so API and images work.

## Setup

```bash
docker compose up -d --build
```

No `.env.docker` required — `docker-compose.yml` sets defaults. Optional:

```bash
cp .env.example.docker .env.docker
```

## URLs

- http://localhost:3000/en
- http://localhost:3000/ar

## Commands

```bash
docker compose ps
docker compose logs -f frontend
docker compose down
```

## Env (set in docker-compose.yml)

| Variable | Default |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` |
| `NEXT_PUBLIC_CMS_URL` | `http://localhost:8000` |
| `CMS_INTERNAL_URL` | `http://host.docker.internal:8000` |

Change these in `docker-compose.yml` for production domains.
