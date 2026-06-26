import { motion } from "framer-motion";
import Avatar from "../ui/Avatar";

const feed = [
  { who: "Meera Rao", did: "moved", what: "Security review", to: "Review", t: "2m", c: "#A855F7" },
  { who: "Aarav Shetty", did: "completed", what: "Database schema", to: "Done", t: "18m", c: "#22C55E" },
  { who: "You", did: "commented on", what: "Build auth service", t: "1h", c: "#6366F1" },
  { who: "Karthik Nayak", did: "created", what: "CI pipeline", to: "To Do", t: "3h", c: "#F59E0B" },
  { who: "Riya Pai", did: "assigned", what: "Landing page", t: "5h", c: "#0EA5E9" },
];

export default function ActivityCard() {
  return (
    <div className="card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Activity</h3>
        <button className="text-xs text-accent-soft hover:underline">View all</button>
      </div>
      <div className="mt-5 relative flex-1">
        <span className="absolute left-[15px] top-1 bottom-1 w-px bg-line" />
        <div className="flex flex-col gap-5">
          {feed.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }} className="flex gap-3 relative">
              <div className="relative z-10"><Avatar name={f.who} size={32} /></div>
              <div className="text-sm leading-snug">
                <p className="text-muted">
                  <span className="text-ink font-semibold">{f.who}</span> {f.did}{" "}
                  <span className="text-ink">{f.what}</span>
                  {f.to && <> → <span style={{ color: f.c }}>{f.to}</span></>}
                </p>
                <p className="text-xs text-faint mt-0.5">{f.t} ago</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
