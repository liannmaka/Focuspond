import TaskNav from "../_components/TaskNav";
// import EnergyOverview from "../_components/EnergyOverview";
// import FrogsSummary from "../_components/FrogsSummary";

export default function DashboardPanel() {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {/* Row 1 */}
      {/* text-lg font-sora font-semibold text-dark-accent py-3.5 pl-7 border-b border-dark-accent/20 mb-3 */}
      <h2 className="text-lg font-sora font-semibold text-darker-accent py-4 px-6 border-b border-dark-accent/15 mb-0 bg-linear-to-r from-white to-base-background/50">
        Dashboard
      </h2>
      <div className="space-y-6 pt-4">
        {/* Row 2 */}
        <TaskNav />

        {/* Row 3 */}
        {/* <EnergyOverview /> */}

        {/* Row 4 */}
        {/* <FrogsSummary /> */}
      </div>
    </div>
  );
}
