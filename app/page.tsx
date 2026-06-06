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
import RoomFrame from "@/components/room-frame";

const ScrollSceneManager = dynamic(() => import("@/components/3d/scroll-scene-manager"), { ssr: false });

export default function Home() {
  return (
    <ScrollOrchestrator>
      <main className="min-h-screen relative overflow-x-hidden">
        <ScrollSceneManager />

        <RoomFrame>
          <HeroSection />
        </RoomFrame>

        <SectionTransition variant="double-door" />

        <RoomFrame>
          <StorySection />
        </RoomFrame>

        <SectionTransition variant="single-door" />

        <RoomFrame>
          <ProjectsSection />
        </RoomFrame>

        <SectionTransition variant="double-door" />

        <RoomFrame>
          <SkillsBentoSection />
        </RoomFrame>

        <SectionTransition variant="slide-up" />

        <RoomFrame>
          <InsightsSection />
        </RoomFrame>

        <SectionTransition variant="iris" />

        <RoomFrame>
          <ConnectSection />
        </RoomFrame>
      </main>
    </ScrollOrchestrator>
  );
}
