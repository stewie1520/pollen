import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "staging", "production"]),
    PORT: z.coerce.number(),

    POSTGRES_HOST: z.string(),
    POSTGRES_PORT: z.coerce.number(),
    POSTGRES_DB: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),

    KAFKA_BROKER_HOST: z.string(),
    KAFKA_BROKER_PORT: z.coerce.number(),

    ELASTICSEARCH_HOST: z.string(),
    ELASTICSEARCH_PORT: z.coerce.number(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
