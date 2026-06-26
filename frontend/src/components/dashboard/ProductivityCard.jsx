import { Line } from "react-chartjs-2";
import "./charts";
import { baseTooltip, noGrid } from "./charts";

export default function ProductivityCard() {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const data = {
    labels,
    datasets: [
      {
        label: "Completed", data: [12, 19, 14, 23, 28, 18, 26],
        borderColor: "#6366F1", borderWidth: 2.5, tension: 0.45,
        fill: true, pointRadius: 0, pointHoverRadius: 5, pointHoverBackgroundColor: "#6366F1",
        backgroundColor: (ctx) => {
          const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 220);
          g.addColorStop(0, "rgba(99,102,241,.35)"); g.addColorStop(1, "rgba(99,102,241,0)");
          return g;
        },
      },
      {
        label: "Created", data: [8, 12, 10, 15, 20, 11, 16],
        borderColor: "#A855F7", borderWidth: 2, borderDash: [5, 4], tension: 0.45,
        fill: false, pointRadius: 0, pointHoverRadius: 4,
      },
    ],
  };
  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: { tooltip: baseTooltip, legend: { display: false } },
    scales: { x: noGrid, y: { ...noGrid, grid: { color: "#15161a", drawBorder: false } } },
    interaction: { mode: "index", intersect: false },
  };

  return (
    <div className="card p-6 h-full flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg">Productivity</h3>
          <p className="text-sm text-muted">Tasks completed vs created</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-accent" />Completed</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-violet" />Created</span>
        </div>
      </div>
      <div className="mt-4 flex items-end gap-6">
        <div><p className="text-3xl font-bold">142</p><p className="text-xs text-muted">this week</p></div>
        <div className="text-success text-sm font-semibold mb-1">▲ 18% vs last week</div>
      </div>
      <div className="mt-4 flex-1 min-h-[200px]"><Line data={data} options={options} /></div>
    </div>
  );
}
