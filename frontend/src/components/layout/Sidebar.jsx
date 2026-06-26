import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, KanbanSquare, Star, Clock, Archive, Settings,
  ChevronsLeft, Search, Plus, Hexagon,
} from "lucide-react";
import api from "../../lib/api";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/board", label: "Boards", icon: KanbanSquare },
  { to: "/favorites", label: "Favorites", icon: Star },
  { to: "/recent", label: "Recent", icon: Clock },
  { to: "/archive", label: "Archive", icon: Archive },
];

export default function Sidebar({ onOpenPalette }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const w = collapsed ? 76 : 248;

  const handleNewBoard = async () => {
    const title = window.prompt("Board name", "Untitled board");
    if (!title) return;
    try {
      await api.post("/boards", { title: title.trim() || "Untitled board" });
      navigate("/board");
    } catch (err) {
      console.error("Create board failed:", err);
    }
  };

  return (
    <motion.aside
      animate={{ width: w }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="hidden md:flex shrink-0 flex-col bg-sidebar border-r border-line h-screen sticky top-0 p-3"
    >
      <div className="flex items-center gap-2.5 px-2 h-12">
        <div className="grid place-items-center w-9 h-9 rounded-xl bg-accent shadow-glow shrink-0">
          <Hexagon size={18} className="text-white" fill="white" />
        </div>
        {!collapsed && <span className="font-display font-extrabold text-lg tracking-tight">Flux</span>}
      </div>

      {!collapsed && (
        <button
          onClick={() => setCollapsed(true)}
          className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-elevated border border-line grid place-items-center text-muted hover:text-ink"
        >
          <ChevronsLeft size={14} />
        </button>
      )}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-1 w-8 h-8 rounded-lg grid place-items-center text-muted hover:text-ink hover:bg-white/5"
        >
          <ChevronsLeft size={16} className="rotate-180" />
        </button>
      )}

      <button
        onClick={onOpenPalette}
        className={`mt-4 flex items-center gap-2 rounded-xl bg-elevated border border-line text-faint text-sm h-10 ${collapsed ? "justify-center px-0" : "px-3"}`}
      >
        <Search size={16} />
        {!collapsed && <span className="flex-1 text-left">Search…</span>}
        {!collapsed && <kbd className="text-[10px] bg-bg border border-line rounded px-1.5 py-0.5">⌘K</kbd>}
      </button>

      <nav className="mt-5 flex flex-col gap-1">
        {!collapsed && <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-faint">Workspace</p>}
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl h-10 text-sm font-medium transition
               ${collapsed ? "justify-center" : "px-3"}
               ${isActive ? "text-ink bg-white/5" : "text-muted hover:text-ink hover:bg-white/5"}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span layoutId="active-pill"
                    className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-accent" />
                )}
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <button onClick={handleNewBoard} className={`btn-primary w-full ${collapsed ? "!px-0" : ""}`}>
          <Plus size={16} />{!collapsed && "New board"}
        </button>
        <NavLink to="/settings"
          className={`mt-2 flex items-center gap-3 rounded-xl h-10 text-sm text-muted hover:text-ink hover:bg-white/5 ${collapsed ? "justify-center" : "px-3"}`}>
          <Settings size={18} />{!collapsed && "Settings"}
        </NavLink>
      </div>
    </motion.aside>
  );
}
