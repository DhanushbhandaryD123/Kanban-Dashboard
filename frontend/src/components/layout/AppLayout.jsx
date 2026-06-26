import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, KanbanSquare, Star, Settings } from "lucide-react";
import Sidebar from "./Sidebar";
import CommandPalette from "./CommandPalette";
import { useHotkey } from "../../hooks/useCommandPalette";

const mobileNav = [
  { to: "/", icon: LayoutDashboard, end: true },
  { to: "/board", icon: KanbanSquare },
  { to: "/favorites", icon: Star },
  { to: "/settings", icon: Settings },
];

export default function AppLayout() {
  const [palette, setPalette] = useState(false);
  useHotkey("mod+k", () => setPalette(true));

  return (
    <div className="flex min-h-screen">
      <Sidebar onOpenPalette={() => setPalette(true)} />
      <div className="flex-1 min-w-0 pb-20 md:pb-0">
        <Outlet />
      </div>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 px-6 flex items-center justify-around
                      bg-sidebar/90 backdrop-blur-xl border-t border-line">
        {mobileNav.map(({ to, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `p-2.5 rounded-xl ${isActive ? "text-accent bg-accent/10" : "text-muted"}`}>
            <Icon size={20} />
          </NavLink>
        ))}
      </nav>

      <CommandPalette open={palette} onClose={() => setPalette(false)} />
    </div>
  );
}
