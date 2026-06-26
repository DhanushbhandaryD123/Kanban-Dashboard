import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Plus, Sun, ChevronDown, LogOut, User2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";

export default function Topbar({ title = "Dashboard", subtitle }) {
  const { user, logout } = useAuth();
  const [menu, setMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 px-5 md:px-8 flex items-center gap-4
                       border-b border-line bg-bg/70 backdrop-blur-xl">
      <div className="min-w-0">
        <h1 className="font-display font-bold text-xl leading-none truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted mt-1 truncate">{subtitle}</p>}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button className="btn-ghost !p-2.5 rounded-xl relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-danger" />
        </button>
        <button className="btn-ghost !p-2.5 rounded-xl"><Sun size={18} /></button>
        <button className="btn-primary !px-3.5 hidden sm:flex"><Plus size={16} />Create</button>

        <div className="relative ml-1">
          <button onClick={() => setMenu((m) => !m)}
            className="flex items-center gap-2 rounded-xl pl-1 pr-2 py-1 hover:bg-white/5">
            <Avatar name={user?.name} src={user?.avatar} size={30} />
            <ChevronDown size={15} className="text-muted hidden sm:block" />
          </button>
          <AnimatePresence>
            {menu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: .98 }}
                  className="absolute right-0 mt-2 w-52 card p-1.5 z-20"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold truncate">{user?.name}</p>
                    <p className="text-xs text-muted truncate">{user?.email}</p>
                  </div>
                  <div className="h-px bg-line my-1" />
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted hover:text-ink hover:bg-white/5">
                    <User2 size={16} /> Profile
                  </button>
                  <button onClick={logout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-danger hover:bg-danger/10">
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
