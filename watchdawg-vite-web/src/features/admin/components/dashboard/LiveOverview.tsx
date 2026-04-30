export default function LiveOverview({ live }: any) {
  const active = live.filter((l: any) => l.status === "active").length;
  const idle = live.filter((l: any) => l.status === "idle").length;
  const away = live.filter((l: any) => l.status === "away").length;

  return (
    <div className="grid md:grid-cols-3 gap-5">

      <Stat title="Active" value={active} color="green" />
      <Stat title="Idle" value={idle} color="yellow" />
      <Stat title="Away" value={away} color="red" />

    </div>
  );
}

function Stat({ title, value, color }: any) {
  return (
    <div className="p-5 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
      <p className="text-xs text-gray-400">{title}</p>
      <h2 className={`text-2xl font-bold text-${color}-400`}>
        {value}
      </h2>
    </div>
  );
}
