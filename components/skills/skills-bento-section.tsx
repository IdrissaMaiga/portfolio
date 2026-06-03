"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import BentoGrid from "./bento-grid";
import FloatingCodeBlock from "@/components/floating-code-block";

const InteractiveScene = dynamic(() => import("@/components/3d/interactive-scene"), { ssr: false });

export default function SkillsBentoSection() {
  return (
    <section
      id="skills"
      className="relative py-12 sm:py-16 lg:py-20 overflow-hidden bg-[#030712]"
    >
      {/* ---- Floating code block ---- */}
      <FloatingCodeBlock
        code={`const skills = {\n  languages: ["Java", "TypeScript"],\n  frameworks: ["Spring", "React"],\n  cloud: ["AWS", "Docker"],\n  ai: ["Gemini", "LangChain"],\n};`}
        language="typescript"
        position="left"
        className="top-32"
      />

      {/* Ambient glow blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/[0.12] rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-600/[0.10] rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/[0.10] rounded-full blur-[128px] pointer-events-none" />

      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium backdrop-blur-sm">
            Expertise
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-6 mb-6 text-white">
            Skills &{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Technologies
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg leading-relaxed">
            A comprehensive overview of technical expertise across the full
            development stack
          </p>
        </motion.div>

        {/* Interactive 3D */}
        <InteractiveScene formation="spiral" color="#10b981" height="250px" style="tech" className="mb-10 rounded-2xl overflow-hidden border border-white/[0.06]" />

        {/* Bento grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <BentoGrid />
        </motion.div>
      </div>
    </section>
  );
}
