export function EmployeeReportCard({
  title,
  employeeId,
}: {
  title: string;
  employeeId: string;
}) {
  return (
    <div className="
      bg-gray-800 border border-white/10 rounded-lg p-3
      flex flex-col gap-2
    ">

      <div className="flex items-center gap-2 text-sm text-white">
        📄 {title}
      </div>

      <button
        className="
          text-xs px-2 py-1 rounded-md
          bg-blue-500 hover:bg-blue-600 transition
        "
        onClick={() => {
          console.log("Download", title, employeeId);
        }}
      >
        Download
      </button>

    </div>
  );
}
