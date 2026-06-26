const days = ["S", "M", "T", "W", "T", "F", "S"];
const today = new Date();
const month = today.toLocaleString("en", { month: "long", year: "numeric" });
const start = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
const total = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
const marked = [today.getDate(), today.getDate() + 2, today.getDate() + 5].filter((d) => d <= total);

export default function MiniCalendar() {
  return (
    <div className="card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">{month}</h3>
        <span className="text-xs text-muted">{marked.length} events</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((d, i) => <span key={i} className="text-[11px] text-faint font-semibold py-1">{d}</span>)}
        {Array.from({ length: start }).map((_, i) => <span key={`e${i}`} />)}
        {Array.from({ length: total }).map((_, i) => {
          const d = i + 1;
          const isToday = d === today.getDate();
          const hasEvent = marked.includes(d) && !isToday;
          return (
            <div key={d}
              className={`aspect-square grid place-items-center text-xs rounded-lg relative
                ${isToday ? "bg-accent text-white font-bold" : "text-muted hover:bg-white/5"}`}>
              {d}
              {hasEvent && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
