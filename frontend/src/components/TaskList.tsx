import type { Task } from "@/types/task";
import { TaskItem } from "./TaskItem";

export function TaskList({
  tasks,
  onToggle,
  onDelete,
}: {
  tasks: Task[];
  onToggle: (id: number, completed: boolean) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
}) {
  if (tasks.length === 0) return <div className="empty">暂无任务</div>;
  return (
    <ol className="list">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ol>
  );
}
