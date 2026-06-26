const map = {
  urgent: { bg: "rgba(239,68,68,.14)", fg: "#EF4444", label: "Urgent" },
  high: { bg: "rgba(245,158,11,.14)", fg: "#F59E0B", label: "High" },
  medium: { bg: "rgba(99,102,241,.14)", fg: "#818CF8", label: "Medium" },
  low: { bg: "rgba(148,163,184,.12)", fg: "#94A3B8", label: "Low" },
};

export default function PriorityBadge({ level = "medium" }) {
  const s = map[level] || map.medium;
  return (
    <span className="chip" style={{ background: s.bg, color: s.fg }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.fg }} />
      {s.label}
    </span>
  );
}
