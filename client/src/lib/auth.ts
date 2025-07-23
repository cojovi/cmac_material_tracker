import { apiRequest } from "./queryClient";
import { type LoginCredentials } from "@shared/schema";

export async function login(credentials: LoginCredentials) {
  const response = await apiRequest("POST", "/api/auth/login", credentials);
  return response.json();
}

export async function logout() {
  await apiRequest("POST", "/api/auth/logout");
}

export async function getCurrentUser() {
  const response = await apiRequest("GET", "/api/auth/me");
  return response.json();
}
