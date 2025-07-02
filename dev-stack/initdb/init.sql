-- Connect to the pollen database
\c pollen

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "product" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"sku" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
