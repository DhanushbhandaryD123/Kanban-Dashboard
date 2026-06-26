import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, LayoutDashboard, KanbanSquare, Plus, Settings, CornerDownLeft } from "lucide-react";

const actions = [
  { label: "Go to Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Open Board", icon: KanbanSquare, to: "/board" },
  { label: "Create new task", icon: Plus, to: "/board" },
  { label: "Settings", icon: Settings, to: "/settings" },
];

export default function CommandPalette({ open, onClose }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = actions.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    if (open) { setQ(""); setActive(0); setTimeout(() => inputRef.current?.focus(), 40); }
  }, [open]);

  const run = (a) => { onClose(); navigate(a.to); };

  const onKey = (e) => {
    if (e.key === "ArrowDown") setActive((i) => Math.min(i + 1, results.length - 1));
    if (e.key === "ArrowUp") setActive((i) => Math.max(i - 1, 0));
    if (e.key === "Enter" && results[active]) run(results[active]);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] flex items-start justify-center pt-[14vh] px-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ scale: .97, y: -8, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: .98, y: -6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="relative w-full max-w-xl card overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 border-b border-line">
              <Search size={18} className="text-faint" />
              <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }}
                onKeyDown={onKey} placeholder="Type a command or search…"
                className="flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-faint" />
              <kbd className="text-[10px] bg-elevated border border-line rounded px-1.5 py-1 text-faint">ESC</kbd>
            </div>
            <div className="p-2 max-h-72 overflow-auto">
              {results.length === 0 && <p className="px-3 py-6 text-center text-sm text-faint">No results</p>}
              {results.map((a, i) => (
                <button key={a.label} onMouseEnter={() => setActive(i)} onClick={() => run(a)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                              ${i === active ? "bg-accent/15 text-ink" : "text-muted"}`}>
                  <a.icon size={17} className={i === active ? "text-accent-soft" : ""} />
                  <span className="flex-1 text-left">{a.label}</span>
                  {i === active && <CornerDownLeft size={14} className="text-faint" />}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
