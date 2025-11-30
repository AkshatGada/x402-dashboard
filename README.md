# x402 Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Bun](https://img.shields.io/badge/Built%20with-Bun-000000)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

> Modern, lightning-fast dashboard for sellers to monetize their APIs with the x402 payment protocol on Polygon networks.

## ✨ Features

- 🚀 **Blazing Fast** - Built with Bun + Elysia + SvelteKit (no bloat)
- 🎨 **Modern UI** - Light/Dark mode with smooth animations
- 🟣 **Polygon Native** - Supports Polygon mainnet and Polygon Amoy testnet
- ⚡ **Real-time Preview** - See generated x402 configuration instantly
- 📱 **Responsive** - Works perfectly on all devices
- 🎯 **Simple** - Convert any API to x402-gated in seconds
- 💾 **Zero Config DB** - SQLite with Drizzle ORM
- 🔒 **Type-Safe** - Full TypeScript end-to-end

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | SvelteKit + Tailwind CSS |
| **Backend** | Bun + Elysia.js |
| **Database** | SQLite + Drizzle ORM |
| **Build** | Vite |
| **Package Manager** | Bun |
| **Networks** | Polygon & Polygon Amoy |

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) (v1.0.0+) - Download from https://bun.sh

### Installation

```bash
# Clone the repository
git clone https://github.com/AkshatGada/x402-dashboard.git
cd x402-dashboard

# Install dependencies
bun install

# Start development servers
bun run dev
```

The dashboard will be available at:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000
- **API Docs**: http://localhost:3000/swagger

## 📖 Usage

1. Open http://localhost:5173 in your browser
2. Enter your API endpoint (e.g., `/api/weather`)
3. Set the price in USDC (e.g., `0.01`)
4. Select your Polygon network
5. Enter your wallet address
6. Click "Convert to x402 API"
7. Copy the generated code
8. Deploy and start earning! 💰

## 📁 Project Structure

```
x402-dashboard/
├── apps/
│   ├── api/              # Backend API (Bun + Elysia)
│   │   ├── src/
│   │   │   ├── db/       # Database schema & migrations
│   │   │   └── index.ts  # Main API server
│   │   └── package.json
│   └── web/              # Frontend (SvelteKit)
│       ├── src/
│       │   ├── lib/      # Stores, API client
│       │   ├── routes/   # Pages
│       │   └── app.css   # Styles
│       └── package.json
├── packages/
│   └── shared/           # Shared TypeScript types
│       └── src/types/    # Network, routes, seller types
└── bun.lockb
```

## 🔨 Development

```bash
# Start both servers concurrently
bun run dev

# Start individual servers
bun run dev:api          # API only (port 3000)
bun run dev:web          # Frontend only (port 5173)

# Build for production
bun run build

# Database operations
bun run db:push          # Push schema changes
bun run db:studio        # Open Drizzle Studio
```

## 🌍 Supported Networks

- **Polygon** (Mainnet) - Production environment
- **Polygon Amoy** (Testnet) - Development & testing

## 🎨 Design Features

- **Light/Dark Mode** with system preference detection
- **Smooth Animations** throughout the interface
- **Purple Gradient** (Polygon brand colors)
- **Mobile-First** responsive design
- **Accessibility** focused components

## 📚 Documentation

- [Getting Started Guide](./GETTING_STARTED.md) - Detailed setup instructions
- [Build Summary](./BUILD_SUMMARY.md) - Complete project overview
- [API Documentation](http://localhost:3000/swagger) - Swagger docs (when running)

## 🔄 API Endpoints

### Sellers
- `GET /api/sellers` - List all sellers
- `GET /api/sellers/:id` - Get seller details
- `POST /api/sellers` - Create new seller
- `PATCH /api/sellers/:id` - Update seller

### Conversion
- `POST /api/convert` - Convert API to x402 format

### Health
- `GET /` - Health check

## 🚢 Deployment

### Build for Production

```bash
cd /Users/agada/x402-dashboard
bun run build
```

### Run Production Build

```bash
# API
cd apps/api
bun run dist/index.js

# Frontend
cd apps/web
npx serve dist
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋 Support

For issues, questions, or suggestions, please open an issue on GitHub.

## 🔗 Links

- [x402 Protocol](https://x402.org)
- [Polygon Network](https://polygon.technology)
- [SvelteKit Docs](https://kit.svelte.dev)
- [Bun Documentation](https://bun.sh/docs)

---

Built with ⚡️ and ❤️ for the Polygon community.

