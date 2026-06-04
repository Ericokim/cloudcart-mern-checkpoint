import apiClient from "./client";

export async function createOrder(order) {
  const { data } = await apiClient.post("/orders", order);
  return data;
}

