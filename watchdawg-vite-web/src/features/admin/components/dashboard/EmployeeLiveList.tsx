import ActivityRow from "./ActivityRow";

export default function EmployeeLiveList({ live }: any) {
  return (
    <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10">

      <h3 className="mb-4 text-white font-semibold">
        Live Monitoring
      </h3>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {live.map((l: any) => (
          <ActivityRow key={l.userId} item={l} />
        ))}
      </div>

    </div>
  );
}
