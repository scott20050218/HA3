export type Task = {
  id: number;
  title: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
};

export type StatusFilter = "all" | "pending" | "completed";


