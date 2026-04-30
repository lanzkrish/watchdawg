export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Command Center</h1>
        <p className="text-gray-400 text-sm">
          Real-time organization insights
        </p>
      </div>

      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
        Live Monitoring
      </div>
    </div>
  );
}
