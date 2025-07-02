import { Hono } from "hono";
import { productRouter } from "./products";

export const appRouter = new Hono();
appRouter.route('/products', productRouter);
