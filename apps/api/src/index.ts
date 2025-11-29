import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { db, initDatabase } from "./db";
import { sellers, routes } from "./db/schema";
import { eq } from "drizzle-orm";

// Initialize database
initDatabase();

// Create Elysia app
const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: "x402 Dashboard API",
          version: "1.0.0",
          description: "API for x402 seller dashboard on Polygon networks",
        },
        tags: [
          { name: "sellers", description: "Seller management endpoints" },
          { name: "convert", description: "API conversion endpoints" },
        ],
      },
    })
  )
  .decorate("db", db)

  // Health check
  .get("/", () => ({
    message: "x402 Dashboard API",
    version: "1.0.0",
    status: "healthy",
  }))

  // Get all sellers
  .get(
    "/api/sellers",
    async ({ db }) => {
      const allSellers = await db.query.sellers.findMany({
        with: {
          routes: true,
        },
      });
      return {
        success: true,
        data: allSellers,
      };
    },
    {
      detail: {
        tags: ["sellers"],
        summary: "List all sellers",
      },
    }
  )

  // Get seller by ID
  .get(
    "/api/sellers/:id",
    async ({ params, db }) => {
      const seller = await db.query.sellers.findFirst({
        where: eq(sellers.id, params.id),
        with: {
          routes: true,
        },
      });

      if (!seller) {
        throw new Error("Seller not found");
      }

      return {
        success: true,
        data: seller,
      };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ["sellers"],
        summary: "Get seller by ID",
      },
    }
  )

  // Create new seller
  .post(
    "/api/sellers",
    async ({ body, db }) => {
      const sellerId = `seller_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Insert seller
      const [newSeller] = await db
        .insert(sellers)
        .values({
          id: sellerId,
          sellerId: body.sellerId,
          payTo: body.payTo,
          email: body.email,
          enabled: true,
        })
        .returning();

      // Insert routes if provided
      if (body.routes && body.routes.length > 0) {
        await db.insert(routes).values(
          body.routes.map((route: any) => ({
            id: `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            sellerId: newSeller.id,
            path: route.path,
            price: typeof route.price === "string" ? route.price : JSON.stringify(route.price),
            network: route.network,
            method: route.method || "GET",
            description: route.description,
          }))
        );
      }

      return {
        success: true,
        data: newSeller,
        message: "Seller created successfully",
      };
    },
    {
      body: t.Object({
        sellerId: t.String(),
        payTo: t.String(),
        email: t.Optional(t.String()),
        routes: t.Optional(
          t.Array(
            t.Object({
              path: t.String(),
              price: t.Union([t.String(), t.Object({})]),
              network: t.Union([t.Literal("polygon"), t.Literal("polygon-amoy")]),
              method: t.Optional(t.String()),
              description: t.Optional(t.String()),
            })
          )
        ),
      }),
      detail: {
        tags: ["sellers"],
        summary: "Create new seller",
      },
    }
  )

  // Convert API to x402
  .post(
    "/api/convert",
    async ({ body }) => {
      const { apiUrl, price, network, method = "GET", description, payTo } = body;

      // Parse the API URL to extract path
      let path: string;
      try {
        const url = new URL(apiUrl);
        path = url.pathname;
      } catch {
        // If not a full URL, treat as path
        path = apiUrl.startsWith("/") ? apiUrl : `/${apiUrl}`;
      }

      const routeConfig = {
        path,
        price,
        network,
        method,
        description: description || `Access to ${path}`,
      };

      // Generate code snippets
      const expressCode = generateExpressCode(routeConfig, payTo);
      const elysiaCode = generateElysiaCode(routeConfig, payTo);
      const configCode = JSON.stringify(
        {
          [path]: {
            price,
            network,
            config: {
              description: description || `Access to ${path}`,
            },
          },
        },
        null,
        2
      );

      return {
        success: true,
        route: routeConfig,
        generatedCode: {
          express: expressCode,
          elysia: elysiaCode,
          config: configCode,
        },
      };
    },
    {
      body: t.Object({
        apiUrl: t.String(),
        price: t.String(),
        network: t.Union([t.Literal("polygon"), t.Literal("polygon-amoy")]),
        method: t.Optional(t.String()),
        description: t.Optional(t.String()),
        payTo: t.String(),
      }),
      detail: {
        tags: ["convert"],
        summary: "Convert API endpoint to x402-gated API",
      },
    }
  )

  .listen(3000);

console.log(`🦊 x402 Dashboard API running at ${app.server?.hostname}:${app.server?.port}`);
console.log(`📚 Swagger docs available at http://localhost:3000/swagger`);

// Helper function to generate Express middleware code
function generateExpressCode(route: any, payTo: string): string {
  return `import express from "express";
import { paymentMiddleware } from "x402-express";

const app = express();

// Configure x402 payment middleware
app.use(paymentMiddleware(
  "${payTo}",
  {
    "${route.path}": {
      price: "${route.price}",
      network: "${route.network}",
      config: {
        description: "${route.description || `Access to ${route.path}`}"
      }
    }
  }
));

// Your protected route
app.${route.method.toLowerCase()}("${route.path}", (req, res) => {
  res.json({ 
    message: "This is now a paid API powered by x402!" 
  });
});

app.listen(3000);`;
}

// Helper function to generate Elysia middleware code
function generateElysiaCode(route: any, payTo: string): string {
  return `import { Elysia } from "elysia";
import { paymentMiddleware } from "x402-elysia";

const app = new Elysia()
  .use(paymentMiddleware({
    payTo: "${payTo}",
    routes: {
      "${route.path}": {
        price: "${route.price}",
        network: "${route.network}",
        config: {
          description: "${route.description || `Access to ${route.path}`}"
        }
      }
    }
  }))
  .${route.method.toLowerCase()}("${route.path}", () => ({
    message: "This is now a paid API powered by x402!"
  }))
  .listen(3000);`;
}

