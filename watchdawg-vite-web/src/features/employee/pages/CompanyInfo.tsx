/** @format */

import { Icons } from "@/components/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CompanyInfo() {
  const navigate = useNavigate();

  const sections = [
    {
      key: "overview",
      title: "Company Overview",
      icon: <Icons.Building size={18} />,
    },
    {
      key: "policies",
      title: "Company Policies",
      icon: <Icons.FileText size={18} />,
    },
    {
      key: "ethics",
      title: "Work Ethics",
      icon: <Icons.Briefcase size={18} />,
    },
    {
      key: "systems",
      title: "System Usage",
      icon: <Icons.Monitor size={18} />,
    },
    {
      key: "security",
      title: "Security & Privacy",
      icon: <Icons.Shield size={18} />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold">Company Information</h1>

      <div className="grid md:grid-cols-2 gap-5">
        {sections.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/employee/comapany-info/${s.key}`)}
            className="cursor-pointer bg-gray-900/60 border border-gray-700
            p-6 rounded-2xl hover:bg-gray-800/60 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center
              bg-gray-800 rounded-lg border border-gray-700">
                {s.icon}
              </div>
              <h3 className="font-semibold">{s.title}</h3>
            </div>

            <p className="text-sm text-gray-400 mt-3">
              Click to view detailed information
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
