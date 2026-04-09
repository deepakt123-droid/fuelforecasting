# Future Fuel Trends - Fuel Forecasting Dashboard

React + Vite + TypeScript + Shadcn UI + Recharts app for fuel price forecasting.

## Netlify Deployment

**Build Settings:**
- Base directory: `artifacts/fuel-forecast`
- Build command: `pnpm install && pnpm build`
- Publish directory: `dist/public`

**Environment Variables:**
- `VITE_API_URL`: Backend API base URL (e.g., https://your-api.netlify.app)

## Local Development
```bash
cd artifacts/fuel-forecast
pnpm dev
```

## Production Build
```bash
pnpm build
pnpm serve
```

