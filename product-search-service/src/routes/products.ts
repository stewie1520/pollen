import { zValidator } from "@hono/zod-validator";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db, Product } from "../db";
import { publisherService } from "../pubsub";
import { productSearchService } from "../search-engine";

export const productRouter = new Hono();

productRouter.get(
  "/search",
  zValidator(
    "query",
    z.object({
      query: z.string(),
      from: z.coerce.number().min(0).default(0),
      size: z.coerce.number().min(1).max(100).default(10),
    }),
  ),
  async (c) => {
    const { query, from, size } = c.req.valid("query");

    void publisherService.publish("product-search-events", {
      type: "search",
      query,
      timestamp: new Date().toISOString(),
    });

    const result = await productSearchService.searchProducts({
      query,
      pagination: {
        from,
        size,
      },
    });

    return c.json(result);
  },
);

productRouter.post(
  "/",
  zValidator("json", z.array(z.object({
    name: z.string(),
    description: z.string(),
    sku: z.string(),
  })).max(100)),
  async (c) => {
    const products = c.req.valid("json").map(product => ({
      ...product,
      id: randomUUID(),
    }));

    await db.insert(Product).values(products);

    return c.json({
      created: products.length,
    });
  },
);

productRouter.patch(
  "/:id",
  zValidator("json", z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    sku: z.string().optional(),
  })),
  async (c) => {
    const { id } = c.req.param();
    const { name, description, sku } = c.req.valid("json");

    await db.update(Product).set({
      name,
      description,
      sku,
    }).where(eq(Product.id, id));

    return c.json({
      updated: 1,
    });
  },
)