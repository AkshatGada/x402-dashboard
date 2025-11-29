# x402 Dashboard

Modern, fast-loading dashboard for sellers to monetize their APIs with the x402 payment protocol on Polygon networks.

## Features

- 🚀 **Blazing Fast** - Built with Bun + Elysia + SvelteKit
- 🎨 **Modern UI** - Light/Dark mode with smooth animations
- 🟣 **Polygon Native** - Supports Polygon mainnet and Polygon Amoy testnet
- ⚡ **Real-time Preview** - See generated x402 configuration instantly
- 📱 **Responsive** - Works perfectly on all devices
- 🎯 **Simple** - Convert any API to x402-gated in seconds

## Tech Stack

- **Frontend**: SvelteKit + Tailwind CSS
- **Backend**: Bun + Elysia
- **Database**: SQLite + Drizzle ORM
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed (v1.0.0+)

### Installation

```bash
# Install dependencies
bun install

# Start development servers (API + Web)
bun run dev
```

The dashboard will be available at:
- Frontend: http://localhost:5173
- API: http://localhost:3000

## Project Structure

```
x402-dashboard/
├── apps/
│   ├── web/          # SvelteKit frontend
│   └── api/          # Bun + Elysia backend
├── packages/
│   └── shared/       # Shared TypeScript types
└── package.json
```

## Development

```bash
# Run both servers
bun run dev

# Run only API server
bun run dev:api

# Run only web server
bun run dev:web

# Build for production
bun run build

# Database operations
bun run db:push      # Push schema changes
bun run db:studio    # Open Drizzle Studio
```

## License

MIT

