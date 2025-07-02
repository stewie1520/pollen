import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { env } from "./env";
import { appRouter } from "./routes";

const app = new Hono();
app.route("/", appRouter)

app.notFound((c) => {
  return c.json({ message: "Not Found" }, 404);
});

app.onError((err, c) => {
  return c.json({ message: "Internal Server Error" }, 500);
});

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`🚀 Server is running on http://localhost:${info.port}`);
  },
);
