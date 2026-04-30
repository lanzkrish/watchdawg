import { ReportCard } from "./ReportCard";


type Item = {
  title: string;
};

export function ReportSection({ title, items }: { title: string; items: Item[] }) {
  return (
    <div className="space-y-4">

      <h2 className="text-lg font-medium text-white">
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <ReportCard key={i} title={item.title} />
        ))}
      </div>

    </div>
  );
}
