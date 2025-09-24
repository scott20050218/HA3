import type { Task } from "@/types/task";

export function TaskItem({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (id: number, completed: boolean) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
}) {
  return (
    <li className="item">
      <div className="content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => onToggle(task.id, e.target.checked)}
        />
        <span className={`titleText ${task.completed ? "completed" : ""}`}>
          {task.title}
        </span>
      </div>
      <div className="actions">
        <button
          className="button btn-complete"
          onClick={() => onToggle(task.id, !task.completed)}
        >
          {task.completed ? "取消完成" : "完成"}
        </button>
        <button className="button btn-delete" onClick={() => onDelete(task.id)}>
          删除
        </button>
      </div>
    </li>
  );
}


