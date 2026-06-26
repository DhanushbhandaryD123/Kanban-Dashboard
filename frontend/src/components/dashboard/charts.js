import {
  Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  ArcElement, Filler, Tooltip,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip);

export const baseTooltip = {
  backgroundColor: "#17181B",
  borderColor: "#1F2024",
  borderWidth: 1,
  titleColor: "#F8FAFC",
  bodyColor: "#94A3B8",
  padding: 10,
  cornerRadius: 10,
  displayColors: false,
};

export const noGrid = {
  grid: { display: false, drawBorder: false },
  ticks: { color: "#5B616E", font: { size: 11 } },
  border: { display: false },
};
