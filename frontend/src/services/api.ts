import axios from "axios";
import type { StatusFilter, Task } from "@/types/task";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const client = axios.create({ baseURL: `${BASE_URL}/api/v1` });

// token storage helpers
const TOKEN_KEY = "todo_token";
export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

client.interceptors.request.use((config) => {
  const t = getToken();
  if (t) {
    config.headers = config.headers ?? {};
    (config.headers as any)["Authorization"] = `Bearer ${t}`;
  }
  return config;
});

export const listTasks = async (
  status: StatusFilter = "all"
): Promise<Task[]> => {
  const res = await client.get<Task[]>("/tasks", { params: { status } });
  return res.data;
};

export const createTask = async (title: string): Promise<Task> => {
  const res = await client.post<Task>("/tasks", { title });
  return res.data;
};

export const updateTask = async (
  id: number,
  data: Partial<Pick<Task, "title" | "completed">>
): Promise<Task> => {
  const res = await client.put<Task>(`/tasks/${id}`, data);
  return res.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await client.delete(`/tasks/${id}`);
};

export const clearCompleted = async (): Promise<string> => {
  const res = await client.delete<{ success: boolean; message: string }>(
    `/tasks/completed`
  );
  return res.data.message;
};

export const clearAll = async (): Promise<string> => {
  const res = await client.delete<{ success: boolean; message: string }>(
    `/tasks/all`
  );
  return res.data.message;
};

// auth
export const register = async (
  username: string,
  password: string
): Promise<void> => {
  await client.post(`/auth/register`, { username, password });
};

export const login = async (
  username: string,
  password: string
): Promise<void> => {
  const params = new URLSearchParams();
  params.set("username", username);
  params.set("password", password);
  const res = await client.post<{ access_token: string }>(
    `/auth/login`,
    params,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  saveToken(res.data.access_token);
};

export const me = async (): Promise<{
  id: number;
  username: string;
  role: string;
} | null> => {
  try {
    const res = await client.get(`/auth/me`);
    return res.data;
  } catch {
    return null;
  }
};
