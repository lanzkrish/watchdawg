/** @format */

import { Icons } from "@/components/icons";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

const contentMap: any = {
  overview: {
    title: "Company Overview",
    content: `
Our company focuses on innovation, productivity, and employee growth.
We strive to build a collaborative environment where every individual
can contribute effectively and grow professionally.

We believe in transparency, accountability, and continuous learning.
    `,
  },

  policies: {
    title: "Company Policies",
    content: `
Employees must follow company policies strictly including working hours,
code of conduct, and communication guidelines.

Misuse of company resources or violation of policies may result in
disciplinary action.
    `,
  },

  ethics: {
    title: "Work Ethics",
    content: `
Maintain professionalism in all interactions. Respect your colleagues,
meet deadlines, and ensure quality in your work.

Team collaboration and accountability are highly valued.
    `,
  },

  systems: {
    title: "System Usage",
    content: `
Company systems are monitored to ensure productivity.

Avoid non-work-related usage and ensure all activities align with
assigned responsibilities.
    `,
  },

  security: {
    title: "Security & Privacy",
    content: `
Never share your login credentials. Always log out from shared devices.

Report any suspicious activity immediately to the admin team.
    `,
  },
};

export default function CompanySection() {
  const { section } = useParams();
  const navigate = useNavigate();

  const data = contentMap[section || "overview"];

  if (!data) return <div>Section not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* 🔙 BACK */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-white flex items-center gap-2"
      >
        <Icons.ArrowLeft size={16} /> Back
      </button>

      {/* 📄 TITLE */}
      <h1 className="text-3xl font-bold">{data.title}</h1>

      {/* 📖 CONTENT */}
      <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-6">
        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
          {data.content}
        </p>
      </div>
    </motion.div>
  );
}
