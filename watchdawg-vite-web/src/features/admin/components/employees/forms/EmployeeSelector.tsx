/** @format */

import { useEmployees } from "@/features/admin/hooks/useEmployees";
import { useState } from "react";

type Props = {
  onChange: (ids: string[]) => void;
};

export default function EmployeeSelector({ onChange }: Props) {
  const { employees } = useEmployees();

  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    const updated = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];

    setSelected(updated);
    onChange(updated);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {employees.map((emp) => {
        const isSelected = selected.includes(emp.id);

        return (
          <button
            key={emp.id}
            type="button"
            onClick={() => toggle(emp.id)}
            className={`px-3 py-1 rounded-full text-xs transition ${
              isSelected
                ? "bg-blue-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {emp.name}
          </button>
        );
      })}
    </div>
  );
}
