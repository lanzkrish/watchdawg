/** @format */

import { motion } from "framer-motion";
import { Icons } from "@/components/icons";

type StepStatus = "pending" | "complete" | "error";

const steps = [
  { label: "Company", icon: Icons.Briefcase },
  { label: "Admin", icon: Icons.User },
  { label: "Work", icon: Icons.Clock },
  { label: "Security", icon: Icons.Shield },
];

interface Props {
  step: number;
  progress: number;
  stepStatus: StepStatus[];
}

export default function StepIndicator({ step, progress, stepStatus }: Props) {
  // 🔥 FIX: prevent overflow
  const progressWidth = Math.min((step / (steps.length - 1)) * 100 + progress / steps.length, 100);

  return (
    <div className='relative mb-12 px-2'>
      {/* Background Line */}
      <div className='absolute top-5 left-0 w-full h-[3px] bg-gray-800 rounded-full' />

      {/* Animated RGB Progress Line */}
      <motion.div className='absolute top-5 left-0 h-[3px] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(99,102,241,0.7)]' animate={{ width: `${progressWidth}%` }} transition={{ duration: 0.4 }} />

      {/* Steps */}
      <div className='flex justify-between relative z-10'>
        {steps.map((item, index) => {
          const Icon = item.icon;
          const status = stepStatus[index];

          const isActive = step === index;

          return (
            <div key={index} className='flex flex-col items-center w-full'>
              {/* Circle */}
              <motion.div
                animate={{
                  scale: step >= index ? 1.1 : 1,
                  backgroundColor:
                    status === "complete"
                      ? "#052e1a" // ✅ subtle green bg
                      : status === "error"
                        ? "#3b0a0a"
                        : isActive
                          ? "#3b82f6"
                          : "#374151",
                }}
                className='w-11 h-11 rounded-full flex items-center justify-center shadow-lg border border-gray-700'
              >
                {status === "complete" ? (
                  <Icons.Check size={18} className='text-green-400' /> // ✅ green icon
                ) : status === "error" ? (
                  <Icons.X size={18} className='text-red-400' />
                ) : (
                  <Icon size={18} className={isActive ? "text-white" : "text-gray-300"} />
                )}
              </motion.div>

              {/* Label */}
              <p className={`text-xs mt-2 transition ${status === "complete" ? "text-green-400" : status === "error" ? "text-red-400" : isActive ? "text-blue-400" : "text-gray-500"}`}>{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
