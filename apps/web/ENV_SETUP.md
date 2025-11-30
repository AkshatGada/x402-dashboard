# Environment Variables

## Required

### VITE_WEB3AUTH_CLIENT_ID
Your Web3Auth Client ID from the [Web3Auth Dashboard](https://dashboard.web3auth.io/).

1. Go to https://dashboard.web3auth.io/
2. Create a new project or select an existing one
3. Copy your Client ID
4. Add it to `.env` file:
   ```
   VITE_WEB3AUTH_CLIENT_ID=your_client_id_here
   ```

## Optional

### VITE_API_URL
Backend API URL. Defaults to `http://localhost:3000` if not set.

```
VITE_API_URL=http://localhost:3000
```

## Setup Instructions

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Web3Auth Client ID to `.env`

3. Restart the development server:
   ```bash
   bun run dev
   ```

## Notes

- Never commit `.env` file to version control
- `.env.example` is a template and should be committed
- Environment variables prefixed with `VITE_` are exposed to the browser

