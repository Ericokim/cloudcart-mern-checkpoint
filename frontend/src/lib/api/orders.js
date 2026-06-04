import apiClient from "./client";

export async function createOrder(order) {
  const { data } = await apiClient.post("/orders", order);
  return data;
}

export async function getMyOrders() {
  const { data } = await apiClient.get("/orders/mine");
  return data;
}

