import apiClient from "./client";

export async function getProducts(filters = {}) {
  const { data } = await apiClient.get("/products", {
    params: {
      search: filters.search || undefined,
      sort: filters.sort || undefined,
      stock: filters.stock === "all" ? undefined : filters.stock
    }
  });
  return data;
}
