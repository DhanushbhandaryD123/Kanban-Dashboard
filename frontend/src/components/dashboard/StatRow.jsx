import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, CheckCircle2, Timer, Flame, Users } from "lucide-react";

const stats = [
  { label: "Completed", value: "128", delta: "+12%", up: true, icon: CheckCircle2, color: "#22C55E" },
  { label: "In progress", value: "34", delta: "+4%", up: true, icon: Timer, color: "#F59E0B" },
  { label: "Overdue", value: "6", delta: "-2", up: false, icon: Flame, color: "#EF4444" },
  { label: "Team online", value: "9", delta: "+3", up: true, icon: Users, color: "#6366F1" },
];

export default function StatRow() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <motion.div key={s.label}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
          className="card p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="grid place-items-center w-9 h-9 rounded-xl"
              style={{ background: `${s.color}1f`, color: s.color }}>
              <s.icon size={18} />
            </span>
            <span className={`chip ${s.up ? "text-success" : "text-danger"}`}>
              {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{s.delta}
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
