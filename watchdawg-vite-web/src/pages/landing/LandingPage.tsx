/** @format */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/40 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">Watchdawg</h1>

          <nav className="hidden md:flex gap-8 text-sm text-gray-300">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
          </nav>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-sm font-medium hover:scale-105 transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="pt-32 pb-20 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold leading-tight"
        >
          Track Productivity. <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Boost Performance.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-gray-400 max-w-xl mx-auto"
        >
          Real-time employee monitoring with analytics, screenshots, and smart
          insights.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center gap-4"
        >
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 transition"
          >
            Start Free Trial
          </button>

          <button className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition">
            View Demo
          </button>
        </motion.div>

        {/* Dashboard Mock */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 max-w-5xl mx-auto rounded-2xl bg-gray-900 border border-gray-800 p-6 shadow-2xl"
        >
          <p className="text-gray-400 text-sm">
            📊 Dashboard Preview (replace with real component later)
          </p>
        </motion.div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="px-6 py-20 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Live Monitoring",
            "Screenshot Tracking",
            "App Usage Analytics",
            "Idle Detection",
            "Productivity Insights",
            "Real-time Reports",
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl bg-gray-900 border border-gray-800"
            >
              <h3 className="font-semibold text-lg">{feature}</h3>
              <p className="text-gray-400 text-sm mt-2">
                Powerful tools to manage and monitor your team efficiently.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how" className="px-6 py-20 bg-gray-900/50">
        <h2 className="text-3xl font-bold text-center mb-12">
          How It Works
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 text-center">
          {["Setup Company", "Add Employees", "Start Tracking"].map(
            (step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="p-6"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  {i + 1}
                </div>
                <h3 className="font-semibold">{step}</h3>
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {["Free", "Pro", "Enterprise"].map((plan, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`p-6 rounded-2xl border ${
                i === 1
                  ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500"
                  : "bg-gray-900 border-gray-800"
              }`}
            >
              <h3 className="text-xl font-semibold">{plan}</h3>
              <p className="text-3xl mt-4">
                {i === 0 ? "$0" : i === 1 ? "$9/mo" : "Custom"}
              </p>

              <button className="mt-6 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition">
                Choose Plan
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="text-center py-20 px-6">
        <h2 className="text-3xl font-bold">
          Start tracking your team today 🚀
        </h2>

        <button
          onClick={() => navigate("/register")}
          className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 transition"
        >
          Get Started Now
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-gray-800 py-10 px-6 text-gray-400">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6 text-sm">
          <div>
            <h3 className="text-white font-semibold mb-2">Watchdawg</h3>
            <p>Smart employee monitoring platform.</p>
          </div>

          <div>
            <h4 className="text-white mb-2">Product</h4>
            <p>Features</p>
            <p>Pricing</p>
          </div>

          <div>
            <h4 className="text-white mb-2">Company</h4>
            <p>About</p>
            <p>Contact</p>
          </div>

          <div>
            <h4 className="text-white mb-2">Legal</h4>
            <p>Privacy</p>
            <p>Terms</p>
          </div>
        </div>

        <p className="text-center mt-8 text-xs">
          © 2026 Watchdawg. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
