# Netlify Frontend Deployment Plan Progress


- [x] TODO.md tracking

## Pending ⏳
1. Update code to initialize API base URL from `VITE_API_URL` env var (in main.tsx or provider)
2. Test local build: `cd artifacts/fuel-forecast && VITE_API_URL=http://localhost:3001 pnpm build`
3. Push to GitHub: Repo already set up at https://github.com/deepakt123-droid/fuelforecastingtrends.git
4. Connect Netlify → GitHub repo → Configure build settings → Add VITE_API_URL env var → Deploy
5. Deploy backend separately (api-server) to handle CORS
6. Test production site

## Common Issues Fixes Applied
- pnpm monorepo: PNPM_FLAGS in netlify.toml
- SPA routing: netlify.toml redirects + Wouter base
- Base path: vite.config.ts handles BASE_PATH=/
