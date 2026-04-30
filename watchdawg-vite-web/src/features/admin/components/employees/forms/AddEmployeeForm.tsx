/** @format */

import { useState } from "react";

import GlassCard from "../ui/GlassCard";
import GradientButton from "../ui/GradientButton";
import Input from "../ui/Input";

import { useEmployees } from "@/features/admin/hooks/useEmployees";

export default function AddEmployeeForm() {
  const { createEmployee } = useEmployees();

  const [form, setForm] = useState({
    name: "",
    email: "",
    designation: "",
  });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.designation) return;

    await createEmployee(form);

    // reset
    setForm({
      name: "",
      email: "",
      designation: "",
    });
  };

  return (
    <GlassCard>
      <h2 className="text-white text-lg font-medium mb-4">
        Add Employee
      </h2>

      <div className="grid grid-cols-3 gap-3">

        {/* Name */}
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e: any) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* Email */}
        <Input
          placeholder="Email"
          value={form.email}
          onChange={(e: any) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* Designation Dropdown */}
        <select
          value={form.designation}
          onChange={(e) =>
            setForm({ ...form, designation: e.target.value })
          }
          className="bg-gray-900 text-white border border-white/10 rounded-md px-3 py-2 outline-none focus:border-blue-500"
        >
          <option value="" className="text-gray-400">
            Select designation
          </option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Manager">Manager</option>
        </select>
      </div>

      <div className="mt-4">
        <GradientButton onClick={handleSubmit}>
          Add Employee
        </GradientButton>
      </div>
    </GlassCard>
  );
}
