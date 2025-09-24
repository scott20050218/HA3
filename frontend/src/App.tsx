import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { FilterBar } from '@/components/FilterBar';
import { useTasks } from '@/hooks/useTasks';
import { AuthBar } from '@/components/AuthBar';

export default function App() {
  const { tasks, status, loading, add, toggle, remove, setFilter, clearDone, clearAllTasks } =
    useTasks();

  return (
    <div className="container">
      <h1 className="title">待办事项</h1>
      <AuthBar />
      <TaskForm onAdd={(title) => add(title)} />
      <FilterBar
        status={status}
        onChange={setFilter}
        onClearCompleted={clearDone}
        onClearAll={clearAllTasks}
      />
      {loading ? (
        <div className="empty">加载中...</div>
      ) : (
        <TaskList tasks={tasks} onToggle={toggle} onDelete={remove} />
      )}
    </div>
  );
}
