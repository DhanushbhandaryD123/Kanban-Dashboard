import { Doughnut } from "react-chartjs-2";
import "./charts";
import { baseTooltip } from "./charts";

export default function CompletionCard() {
  const data = {
    labels: ["Done", "In progress", "To do"],
    datasets: [{
      data: [62, 24, 14],
      backgroundColor: ["#22C55E", "#F59E0B", "#2A2C31"],
      borderWidth: 0, hoverOffset: 6,
    }],
  };
  const options = {
    cutout: "72%", responsive: true, maintainAspectRatio: false,
    plugins: { tooltip: baseTooltip, legend: { display: false } },
  };
  return (
    <div className="card p-6 h-full flex flex-col">
      <h3 className="font-bold text-lg">Weekly completion</h3>
      <div className="relative mt-2 flex-1 grid place-items-center min-h-[160px]">
        <Doughnut data={data} options={options} />
        <div className="absolute text-center">
          <p className="text-3xl font-bold">62%</p>
          <p className="text-xs text-muted">on track</p>
        </div>
      </div>
      <div className="flex justify-between text-xs mt-2">
        {[["Done", "#22C55E"], ["Active", "#F59E0B"], ["To do", "#5B616E"]].map(([l, c]) => (
          <span key={l} className="flex items-center gap-1.5 text-muted">
            <span className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
          </span>
        ))}
      </div>
    </div>
  );
}
