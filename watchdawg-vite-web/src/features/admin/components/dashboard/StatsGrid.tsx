export default function StatsGrid({ live }: any) {
  const productive = live.filter((l: any) => l.category === "productive").length;
  const distracting = live.filter((l: any) => l.category === "distracting").length;

  const score =
    productive + distracting === 0
      ? 0
      : Math.round((productive / (productive + distracting)) * 100);

  return (
    <div className="grid md:grid-cols-2 gap-5">

      <Card title="Productivity Score" value={`${score}%`} />
      <Card title="Distracted Users" value={distracting} />

    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="p-5 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
      <p className="text-xs text-gray-400">{title}</p>
      <h2 className="text-2xl font-bold text-white">{value}</h2>
    </div>
  );
}
