import PriorityBadge from "../ui/Badge";

const items = [
  { title: "Build auth service", due: "Today", priority: "urgent", late: false },
  { title: "Design onboarding flow", due: "In 3 days", priority: "high" },
  { title: "Security review", due: "In 5 days", priority: "high" },
  { title: "Marketing page", due: "Next week", priority: "low" },
];

export default function DeadlinesCard() {
  return (
    <div className="card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Upcoming deadlines</h3>
        <span className="chip bg-danger/15 text-danger">2 due soon</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {items.map((t) => (
          <div key={t.title}
            className="flex items-center gap-3 p-3 rounded-xl bg-elevated/60 border border-line/60 hover:border-accent/30 transition group">
            <span className="w-1.5 h-9 rounded-full"
              style={{ background: t.due === "Today" ? "#EF4444" : "#6366F1" }} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate group-hover:text-accent-soft transition">{t.title}</p>
              <p className="text-xs text-muted">{t.due}</p>
            </div>
            <PriorityBadge level={t.priority} />
          </div>
        ))}
      </div>
    </div>
  );
}
