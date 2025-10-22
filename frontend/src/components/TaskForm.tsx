import { useState } from "react";

export function TaskForm({
  onAdd,
}: {
  onAdd: (title: string) => Promise<void> | void;
}) {
  const [title, setTitle] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = title.trim();
    if (!v) return;
    await onAdd(v);
    setTitle("");
  };

  return (
    <form className="form" onSubmit={submit}>
      <input
        className="input"
        placeholder="输入新任务..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="button" type="submit">
        添加
      </button>
    </form>
  );
}











