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

export async function getProduct(id) {
  const { data } = await apiClient.get(`/products/${id}`);
  return data;
}

export async function createProduct(product) {
  const { data } = await apiClient.post("/products", product);
  return data;
}

export async function updateProduct(id, product) {
  const { data } = await apiClient.put(`/products/${id}`, product);
  return data;
}

export async function deleteProduct(id) {
  const { data } = await apiClient.delete(`/products/${id}`);
  return data;
}
