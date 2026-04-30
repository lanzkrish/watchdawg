/** @format */

interface Employee {
  name: string;
  status: string;
  productivity: number;
}

const mockData: Employee[] = [
  { name: "John Doe", status: "Active", productivity: 85 },
  { name: "Jane Smith", status: "Idle", productivity: 60 },
  { name: "Alex Ray", status: "Active", productivity: 92 },
];

export default function EmployeeTable() {
  return (
    <div className='bg-gray-900 p-5 rounded-2xl'>
      <h3 className='mb-4 font-semibold'>Employee Activity</h3>

      <table className='w-full text-left'>
        <thead>
          <tr className='text-gray-400 text-sm'>
            <th>Name</th>
            <th>Status</th>
            <th>Productivity</th>
          </tr>
        </thead>

        <tbody>
          {mockData.map((emp, i) => (
            <tr key={i} className='border-t border-gray-800'>
              <td className='py-3'>{emp.name}</td>
              <td className={`py-3 ${emp.status === "Active" ? "text-green-400" : "text-yellow-400"}`}>{emp.status}</td>
              <td className='py-3'>{emp.productivity}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
