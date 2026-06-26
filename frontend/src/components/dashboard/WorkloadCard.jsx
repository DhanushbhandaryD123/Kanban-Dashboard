import { Bar } from "react-chartjs-2";
import "./charts";
import { baseTooltip, noGrid } from "./charts";

export default function WorkloadCard() {
  const data = {
    labels: ["Aarav", "Meera", "Karthik", "You", "Riya"],
    datasets: [{
      data: [9, 14, 6, 11, 8],
      backgroundColor: ["#6366F1", "#A855F7", "#22C55E", "#F59E0B", "#0EA5E9"],
      borderRadius: 8, barThickness: 22,
    }],
  };
  const options = {
    indexAxis: "y", responsive: true, maintainAspectRatio: false,
    plugins: { tooltip: baseTooltip, legend: { display: false } },
    scales: { x: { ...noGrid, grid: { color: "#15161a" } }, y: noGrid },
  };
  return (
    <div className="card p-6 h-full flex flex-col">
      <h3 className="font-bold text-lg">Workload</h3>
      <p className="text-sm text-muted">Active tasks per member</p>
      <div className="mt-4 flex-1 min-h-[180px]"><Bar data={data} options={options} /></div>
    </div>
  );
}
