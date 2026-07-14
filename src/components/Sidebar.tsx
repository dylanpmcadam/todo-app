import { Home, Layers, CheckSquare, Settings, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia("(min-width: 768px)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const isVisible = isDesktop || isOpen;

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-gray-200 bg-white p-6 transition-transform duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-800 md:relative md:z-auto md:translate-x-0 md:transition-none",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
      aria-hidden={isVisible ? undefined : true}
    >
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
            <Layers className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold dark:text-gray-100">
            Dylan's Todos
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus:ring-gray-600"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        <NavItem
          icon={<Home className="h-5 w-5" />}
          label="Home"
          active
          onNavigate={onClose}
        />
        <NavItem
          icon={<CheckSquare className="h-5 w-5" />}
          label="Tasks"
          onNavigate={onClose}
        />
        <NavItem
          icon={<Layers className="h-5 w-5" />}
          label="Projects"
          onNavigate={onClose}
        />
        <NavItem
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          onNavigate={onClose}
        />
      </nav>

      <div className="border-t border-gray-100 pt-6 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            <User className="h-full w-full p-2 text-gray-400" />
          </div>
          <div className="min-w-0 text-sm">
            <p className="truncate font-medium text-gray-900 dark:text-gray-100">
              Dylan McAdam
            </p>
            <p className="truncate text-gray-500 dark:text-gray-400">
              dylanpmcadam@gmail.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  onNavigate,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <a
      href="#"
      onClick={onNavigate}
      className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}