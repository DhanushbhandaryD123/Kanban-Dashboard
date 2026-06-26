import { motion } from "framer-motion";
import Topbar from "../components/layout/Topbar";
import StatRow from "../components/dashboard/StatRow";
import ProductivityCard from "../components/dashboard/ProductivityCard";
import WorkloadCard from "../components/dashboard/WorkloadCard";
import CompletionCard from "../components/dashboard/CompletionCard";
import ActivityCard from "../components/dashboard/ActivityCard";
import DeadlinesCard from "../components/dashboard/DeadlinesCard";
import MiniCalendar from "../components/dashboard/MiniCalendar";
import { useAuth } from "../context/AuthContext";

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }),
};

export default function Dashboard() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <Topbar title={`${greet}, ${user?.name?.split(" ")[0] || "there"}`}
        subtitle="Here's what's moving across your workspace today" />

      <div className="p-5 md:p-8 space-y-5">
        <StatRow />

        {/* Bento: deliberately uneven spans */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <motion.div variants={fade} initial="hidden" animate="show" custom={1}
            className="lg:col-span-8 min-h-[340px]">
            <ProductivityCard />
          </motion.div>
          <motion.div variants={fade} initial="hidden" animate="show" custom={2}
            className="lg:col-span-4 lg:row-span-2">
            <ActivityCard />
          </motion.div>

          <motion.div variants={fade} initial="hidden" animate="show" custom={3}
            className="lg:col-span-4">
            <CompletionCard />
          </motion.div>
          <motion.div variants={fade} initial="hidden" animate="show" custom={4}
            className="lg:col-span-4">
            <MiniCalendar />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <motion.div variants={fade} initial="hidden" animate="show" custom={5}
            className="lg:col-span-7">
            <DeadlinesCard />
          </motion.div>
          <motion.div variants={fade} initial="hidden" animate="show" custom={6}
            className="lg:col-span-5">
            <WorkloadCard />
          </motion.div>
        </div>
      </div>
    </>
  );
}
