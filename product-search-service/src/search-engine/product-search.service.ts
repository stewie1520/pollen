export interface SearchQuery {
  query: string;
  pagination: SearchPagination;
  sort?: SearchSort;
}

export interface SearchSort {
  field: "name" | "sku" | "_score";
  order: "asc" | "desc";
}

export interface SearchPagination {
  from: number;
  size: number;
}

export interface SearchResult {
  products: ProductSearchHit[];
  total: number;
  from: number;
  size: number;
}

export interface ProductSearchHit {
  id: number;
  name: string;
  description: string;
  sku: string;
  score?: number;
}

export abstract class ProductSearchService {
  abstract searchProducts(searchQuery: SearchQuery): Promise<SearchResult>
}
