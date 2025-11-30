# Troubleshooting Guide

## Common Issues & Solutions

### Port Already in Use

**Problem**: Port 3000 or 5173 is already in use

```bash
# Find process using port 3000
lsof -i :3000

# Find process using port 5173
lsof -i :5173

# Kill the process
kill -9 <PID>
```

### Bun Installation Issues

**Problem**: Bun won't install or update

```bash
# Reinstall Bun
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

### Database Errors

**Problem**: Database tables not created or corrupted

```bash
cd apps/api

# Reset database
rm x402-dashboard.db

# Recreate tables
bun run src/db/migrate.ts
```

### Dependencies Not Installing

**Problem**: Dependencies fail to install

```bash
# Clear cache
bun pm cache clean

# Reinstall all
rm -rf node_modules bun.lockb
bun install
```

### Frontend Won't Compile

**Problem**: SvelteKit compilation errors

```bash
cd apps/web

# Clear SvelteKit cache
rm -rf .svelte-kit
rm -rf build

# Restart dev server
bun run dev
```

### API Server Crashes

**Problem**: API server exits unexpectedly

```bash
# Check logs for errors
cd apps/api
bun run --hot src/index.ts

# Look for error messages in output
```

### Theme Not Switching

**Problem**: Light/Dark mode toggle doesn't work

1. Check browser console for errors (F12)
2. Verify localStorage is enabled
3. Clear browser cache
4. Try in incognito mode

### Copy to Clipboard Not Working

**Problem**: Copy button doesn't copy code

1. Ensure HTTPS or localhost (security requirement)
2. Check browser permissions
3. Try different browser

### API Not Responding

**Problem**: Frontend can't reach API

```bash
# Check if API is running
curl http://localhost:3000

# Verify CORS headers
curl -i -X OPTIONS http://localhost:3000/api/convert

# Check if proxy is configured in vite.config.ts
```

## Performance Tips

### Optimize for Development

```bash
# Use separate terminals for servers
# Terminal 1: API
bun run dev:api

# Terminal 2: Web
bun run dev:web
```

### Optimize for Production

```bash
# Build minified versions
bun run build

# Test production build
bun run preview
```

## Debugging

### Enable Verbose Logging

```bash
# API debugging
cd apps/api
DEBUG=* bun run --hot src/index.ts

# Frontend debugging
cd apps/web
bun run dev -- --debug
```

### Database Inspection

```bash
# Open Drizzle Studio
cd apps/api
bun run db:studio
```

### API Testing

```bash
# Health check
curl http://localhost:3000

# Get all sellers
curl http://localhost:3000/api/sellers

# Test conversion
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "apiUrl": "/api/test",
    "price": "$0.01",
    "network": "polygon-amoy",
    "payTo": "0x0000000000000000000000000000000000000000"
  }'
```

## Reset Everything

**Nuclear option** - Start fresh:

```bash
cd /Users/agada/x402-dashboard

# Stop servers (Ctrl+C)

# Clean everything
rm -rf node_modules apps/*/node_modules bun.lockb
rm -rf apps/api/x402-dashboard.db
rm -rf apps/web/.svelte-kit apps/web/build

# Reinstall and start
bun install
bun run dev
```

## Need More Help?

1. Check the [README.md](README.md) for overview
2. Read [GETTING_STARTED.md](GETTING_STARTED.md) for detailed setup
3. Visit [x402.org](https://x402.org) for protocol details
4. Check [Bun docs](https://bun.sh/docs) for runtime issues
5. Open an issue on [GitHub](https://github.com/AkshatGada/x402-dashboard/issues)

---

**Still stuck?** Create a GitHub issue with:
- Error message
- Steps to reproduce
- Your environment (OS, Bun version, Node version)

