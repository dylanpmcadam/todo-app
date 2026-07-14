import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "motion/react";
import { Check, GripVertical, Trash2 } from "lucide-react";
import clsx from "clsx";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style}>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10, transition: { duration: 0.2 } }}
        transition={{ type: "spring", stiffness: 500, damping: 50 }}
        role="button"
        tabIndex={0}
        onClick={() => onToggle(todo.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle(todo.id);
          }
        }}
        className={clsx(
          "group mb-3 flex cursor-pointer items-center justify-between gap-2 rounded-2xl border border-transparent bg-white p-3 shadow-sm transition-shadow hover:border-gray-100 hover:shadow-md sm:p-4 dark:bg-gray-800 dark:hover:border-gray-700",
          todo.completed && "bg-gray-50 opacity-60 dark:bg-gray-800/50",
          isDragging && "z-10 opacity-90 shadow-lg",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden sm:gap-3">
          <button
            type="button"
            className="shrink-0 cursor-grab touch-none rounded-lg p-1 text-gray-300 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100 focus:outline-none active:cursor-grabbing dark:text-gray-600"
            aria-label="Drag to reorder"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <motion.div
            aria-hidden="true"
            className={clsx(
              "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              todo.completed
                ? "border-green-500 bg-green-500 text-white"
                : "border-gray-300 group-hover:border-gray-400 dark:border-gray-600 dark:group-hover:border-gray-500",
            )}
          >
            {todo.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </motion.div>
            )}
          </motion.div>
          <span
            className={clsx(
              "min-w-0 flex-1 truncate font-medium text-gray-900 transition-colors select-none dark:text-gray-100",
              todo.completed &&
                "text-gray-500 line-through decoration-gray-300 dark:text-gray-400 dark:decoration-gray-600",
            )}
          >
            {todo.text}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.1, color: "#ef4444" }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(todo.id);
          }}
          className="shrink-0 cursor-pointer rounded-lg p-2 text-gray-400 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100 focus:outline-none dark:text-gray-500 dark:hover:text-red-400"
          aria-label="Delete todo"
        >
          <Trash2 className="h-4 w-4" />
        </motion.button>
      </motion.div>
    </li>
  );
}
