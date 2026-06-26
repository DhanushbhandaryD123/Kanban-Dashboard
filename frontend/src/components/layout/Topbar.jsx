import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Plus, Sun, Moon, ChevronDown, LogOut, User2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Avatar from "../ui/Avatar";

const formatTime = (ts) => {
  const diff = Date.now() - ts;
  if (diff < 60e3)   return "Just now";
  if (diff < 3600e3) return `${Math.floor(diff / 60e3)}m ago`;
  if (diff < 864e5)  return `${Math.floor(diff / 3600e3)}h ago`;
  return new Date(ts).toLocaleDateString();
};

export default function Topbar({ title = "Dashboard", subtitle, notifications = [], onNotifsRead }) {
  const { user, logout }     = useAuth();
  const { theme, toggle }    = useTheme();
  const [userMenu,  setUserMenu]  = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unread = notifications.filter(n => !n.read).length;

  const handleBellClick = () => {
    const next = !notifOpen;
    setNotifOpen(next);
    if (next && onNotifsRead) onNotifsRead();
  };

  return (
    <header className="sticky top-0 z-30 h-16 px-5 md:px-8 flex items-center gap-4
                       border-b border-line bg-bg/70 backdrop-blur-xl">
      <div className="min-w-0">
        <h1 className="font-display font-bold text-xl leading-none truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted mt-1 truncate">{subtitle}</p>}
      </div>

      <div className="ml-auto flex items-center gap-1.5">

        {/* Notifications bell */}
        <div className="relative">
          <button onClick={handleBellClick} className="btn-ghost !p-2.5 rounded-xl relative">
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-danger" />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0,  scale: 1    }}
                  exit={{   opacity: 0, y: -6, scale: 0.97  }}
                  className="absolute right-0 mt-2 w-80 card z-40 overflow-hidden p-0"
                >
                  <div className="px-4 py-3 border-b border-line flex items-center justify-between">
                    <span className="font-semibold text-sm">Notifications</span>
                    {unread > 0 && (
                      <span className="text-xs text-muted">{unread} unread</span>
                    )}
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-sm text-muted text-center py-8">No notifications yet</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 border-b border-line/50 last:border-0
                            ${!n.read ? "bg-accent/5" : ""}`}
                        >
                          <p className="text-sm text-ink">{n.text}</p>
                          <p className="text-xs text-faint mt-0.5">{formatTime(n.time)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <button onClick={toggle} className="btn-ghost !p-2.5 rounded-xl" title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="btn-primary !px-3.5 hidden sm:flex"><Plus size={16} />Create</button>

        {/* User menu */}
        <div className="relative ml-1">
          <button
            onClick={() => setUserMenu(m => !m)}
            className="flex items-center gap-2 rounded-xl pl-1 pr-2 py-1 hover:bg-black/5 dark:hover:bg-white/5"
          >
            <Avatar name={user?.name} src={user?.avatar} size={30} />
            <ChevronDown size={15} className="text-muted hidden sm:block" />
          </button>

          <AnimatePresence>
            {userMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setUserMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0,  scale: 1    }}
                  exit={{   opacity: 0, y: -6, scale: 0.98  }}
                  className="absolute right-0 mt-2 w-52 card p-1.5 z-20"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold truncate">{user?.name}</p>
                    <p className="text-xs text-muted truncate">{user?.email}</p>
                  </div>
                  <div className="h-px bg-line my-1" />
                  <button
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted hover:text-ink hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <User2 size={16} /> Profile
                  </button>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-danger hover:bg-danger/10"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
