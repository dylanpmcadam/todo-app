import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Menu, Moon, Sun } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { AddTodo } from "./components/AddTodo";
import { TodoItem } from "./components/TodoItem";
import "./index.css";
import { motion } from "motion/react";
import { Analytics } from '@vercel/analytics/next';

function getInitialDarkMode() {
  const stored = localStorage.getItem("theme");
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

function App() {
  const [isDark, setIsDark] = useState(getInitialDarkMode);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", text: "Design new landing page", completed: false },
    { id: "2", text: "Review pull requests", completed: true },
    { id: "3", text: "Update documentation", completed: false },
  ]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const reorderTodos = (activeId: string, overId: string) => {
    setTodos((items) => {
      const oldIndex = items.findIndex((todo) => todo.id === activeId);
      const newIndex = items.findIndex((todo) => todo.id === overId);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderTodos(active.id as string, over.id as string);
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setSidebarOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 font-sans text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12">
          <header className="mb-6 flex items-start justify-between gap-3 sm:mb-8 sm:gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="mt-0.5 shrink-0 rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 md:hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus:ring-gray-600"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
                  Today's Tasks
                </h1>
                <p className="mt-1 text-sm text-gray-500 sm:text-base dark:text-gray-400">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              className="shrink-0 rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus:ring-gray-600"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </header>

          <AddTodo onAdd={addTodo} />

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1 text-sm font-medium text-gray-400 dark:text-gray-500">
              <span>Tasks — {todos.filter((t) => !t.completed).length}</span>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={todos.map((todo) => todo.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul>
                  {todos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>

            {todos.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center text-gray-400 dark:text-gray-500"
              >
                <p>No tasks yet. Add one above!</p>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      <Analytics />
    </div>
  );
}

export default App;