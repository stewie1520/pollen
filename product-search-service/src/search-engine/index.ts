import { ElasticProductSearchService } from "./es-product-search.service";
import type { ProductSearchService } from "./product-search.service";

export const productSearchService: ProductSearchService = await ElasticProductSearchService.getInstance();
