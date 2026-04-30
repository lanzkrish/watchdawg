/** @format */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import StepIndicator from "@/components/auth/StepIndicator";
import CompanyStep from "@/components/auth/steps/CompanyStep";
import AdminStep from "@/components/auth/steps/AdminStep";
import WorkStep from "@/components/auth/steps/WorkStep";
import SecurityStep from "@/components/auth/steps/SecurityStep";

/* 🔥 IMPORT SHARED TYPES */
import type { FormData, FormChangeHandler } from "@/types/auth";

type StepStatus = "pending" | "complete" | "error";

export default function AdminRegister() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const [stepStatus, setStepStatus] = useState<StepStatus[]>(["pending", "pending", "pending", "pending"]);

  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    industry: "",
    companySize: "",
    fullName: "",
    email: "",
    password: "",
    workHours: "",
    trackingMode: "",
    idleTime: "",
    screenshots: false,
    appTracking: false,
  });

  /* ✅ Typed handler using shared type */
  const handleChange: FormChangeHandler = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    setStepStatus((prev) => {
      const updated = [...prev];
      if (updated[step] === "error") {
        updated[step] = "pending";
      }
      return updated;
    });
  };

  /* ✅ Progress */
  useEffect(() => {
    let filled = 0;
    let total = 1;

    if (step === 0) {
      total = 2;
      if (formData.companyName) filled++;
      if (formData.industry) filled++;
    }

    if (step === 1) {
      total = 3;
      if (formData.fullName) filled++;
      if (formData.email) filled++;
      if (formData.password) filled++;
    }

    if (step === 2) {
      total = 2;
      if (formData.workHours) filled++;
      if (formData.trackingMode) filled++;
    }

    if (step === 3) {
      total = 1;
      if (formData.idleTime) filled++;
    }

    setProgress((filled / total) * 100);
  }, [formData, step]);

  /* ✅ Validation */
  const isStepValid = (): boolean => {
    if (step === 0) return !!(formData.companyName && formData.industry);
    if (step === 1) return !!(formData.fullName && formData.email && formData.password);
    if (step === 2) return !!(formData.workHours && formData.trackingMode);
    if (step === 3) return !!formData.idleTime;
    return false;
  };

  /* ✅ Next */
  const next = () => {
    if (!isStepValid()) {
      setStepStatus((prev) => {
        const updated = [...prev];
        updated[step] = "error";
        return updated;
      });
      return;
    }

    setStepStatus((prev) => {
      const updated = [...prev];
      updated[step] = "complete";
      return updated;
    });

    setStep((prev) => Math.min(prev + 1, 3));
  };

  const back = () => setStep((prev) => Math.max(prev - 1, 0));

  /* ✅ Submit */
  const handleSubmit = () => {
    if (!isStepValid()) {
      setStepStatus((prev) => {
        const updated = [...prev];
        updated[step] = "error";
        return updated;
      });
      return;
    }

    setStepStatus((prev) => {
      const updated = [...prev];
      updated[step] = "complete";
      return updated;
    });

    /* 🔥 Store role */
    localStorage.setItem("role", "admin");

    navigate("/greeting", {
      state: {
        type: "register",
        role: "admin",
      },
    });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white px-4'>
      <div className='bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 p-8 rounded-3xl w-full max-w-xl shadow-2xl'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Create Organization</h1>

        <StepIndicator step={step} progress={progress} stepStatus={stepStatus} />

        <motion.div key={step} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
          {step === 0 && <CompanyStep formData={formData} onChange={handleChange} />}
          {step === 1 && <AdminStep formData={formData} onChange={handleChange} />}
          {step === 2 && <WorkStep formData={formData} onChange={handleChange} />}
          {step === 3 && <SecurityStep formData={formData} onChange={handleChange} />}
        </motion.div>

        <div className='flex justify-between mt-6'>
          {step > 0 && (
            <button onClick={back} className='px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition'>
              Back
            </button>
          )}

          {step < 3 ? (
            <button onClick={next} disabled={!isStepValid()} className={`ml-auto px-4 py-2 rounded-lg transition ${isStepValid() ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-700/50 text-gray-400 cursor-not-allowed"}`}>
              Next
            </button>
          ) : (
            <button onClick={handleSubmit} className='ml-auto px-5 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 hover:scale-105 transition'>
              Create Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
