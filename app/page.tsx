"use client";

import dynamic from "next/dynamic";
import ScrollOrchestrator from "@/components/scroll-orchestrator";
import HeroSection from "@/components/hero-section";
import StorySection from "@/components/story-section";
import ProjectsSection from "@/components/projects-section";
import SkillsBentoSection from "@/components/skills/skills-bento-section";
import InsightsSection from "@/components/insights-section";
import ConnectSection from "@/components/connect-section";
import SectionTransition from "@/components/section-transition";

const ScrollSceneManager = dynamic(() => import("@/components/3d/scroll-scene-manager"), { ssr: false });

export default function Home() {
  return (
    <ScrollOrchestrator>
      <main className="min-h-screen relative overflow-x-hidden">
        <ScrollSceneManager />
        <HeroSection />
        <SectionTransition variant="light-sweep" />
        <StorySection />
        <SectionTransition variant="morph-boost" />
        <ProjectsSection />
        <SectionTransition variant="light-sweep" />
        <SkillsBentoSection />
        <SectionTransition variant="morph-boost" />
        <InsightsSection />
        <SectionTransition variant="spotlight-in" />
        <ConnectSection />
      </main>
    </ScrollOrchestrator>
  );
}
