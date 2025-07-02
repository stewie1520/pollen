import { defineConfig } from "drizzle-kit";
import { env } from "./src/env";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    database: env.POSTGRES_DB,
    user: env.POSTGRES_USER,
    ssl: false,
    password: env.POSTGRES_PASSWORD,
  },
  schema: "./src/db/index.ts",
  out: "./drizzle",
});
