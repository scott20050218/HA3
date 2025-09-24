import { useEffect, useState } from "react";
import type { StatusFilter, Task } from "@/types/task";
import {
  clearAll,
  clearCompleted,
  createTask,
  deleteTask,
  listTasks,
  updateTask,
} from "@/services/api";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(false);

  const refresh = async (s: StatusFilter = status) => {
    setLoading(true);
    try {
      const data = await listTasks(s);
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh("all");
  }, []);

  const add = async (title: string) => {
    const item = await createTask(title);
    await refresh(status);
    return item;
  };

  const toggle = async (id: number, completed: boolean) => {
    const item = await updateTask(id, { completed });
    await refresh(status);
    return item;
  };

  const remove = async (id: number) => {
    await deleteTask(id);
    await refresh(status);
  };

  const setFilter = async (s: StatusFilter) => {
    setStatus(s);
    await refresh(s);
  };

  const clearDone = async () => {
    await clearCompleted();
    await refresh(status);
  };

  const clearAllTasks = async () => {
    await clearAll();
    await refresh(status);
  };

  return {
    tasks,
    status,
    loading,
    add,
    toggle,
    remove,
    setFilter,
    clearDone,
    clearAllTasks,
  };
}


