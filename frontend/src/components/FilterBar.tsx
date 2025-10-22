import type { StatusFilter } from "@/types/task";

export function FilterBar({
  status,
  onChange,
  onClearCompleted,
  onClearAll,
}: {
  status: StatusFilter;
  onChange: (s: StatusFilter) => Promise<void> | void;
  onClearCompleted: () => Promise<void> | void;
  onClearAll: () => Promise<void> | void;
}) {
  return (
    <div className="toolbar">
      <div className="filters">
        {(["all", "pending", "completed"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            className={`filter ${status === s ? "active" : ""}`}
            onClick={() => onChange(s)}
          >
            {s === "all" ? "全部" : s === "pending" ? "未完成" : "已完成"}
          </button>
        ))}
      </div>
      <div className="actions">
        <button className="button" onClick={onClearCompleted}>
          清除已完成
        </button>
        <button className="button" onClick={onClearAll}>
          清除全部
        </button>
      </div>
    </div>
  );
}






